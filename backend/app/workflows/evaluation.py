from __future__ import annotations

import traceback
from uuid import UUID

from app.db.mongo import get_mongo_db
from app.graphs.evaluation_graph import build_evaluation_graph
from app.services.job_service import append_job_log, update_job


async def run_evaluation_job(*, job_id: str, evaluation_id: UUID, tender_id: UUID, vendor_id: UUID) -> None:
    try:
        await update_job(job_id, status="processing", progress=10, current_step="Starting evaluation workflow (LangGraph)")
        await append_job_log(job_id, "Evaluation started")

        db = get_mongo_db()
        criteria_doc = await db.tender_criteria.find_one({"tender_id": str(tender_id)})
        evidence_doc = await db.vendor_evidence.find_one({"vendor_id": str(vendor_id), "tender_id": str(tender_id)})
        criteria = (criteria_doc or {}).get("criteria", [])
        evidence = (evidence_doc or {}).get("evidence", [])

        graph = build_evaluation_graph()
        final_state = await graph.ainvoke(
            {
                "job": {"job_id": job_id, "job_type": "evaluation"},
                "evaluation_id": str(evaluation_id),
                "tender_id": str(tender_id),
                "vendor_id": str(vendor_id),
                "criteria": criteria,
                "evidence": evidence,
            }
        )
        result = final_state.get("result") or {"overall_verdict": "needs_review", "score": 0.0, "confidence": 0.0, "criteria_breakdown": []}

        await db.evaluation_results.replace_one(
            {"evaluation_id": str(evaluation_id)},
            {
                "evaluation_id": str(evaluation_id),
                "tender_id": str(tender_id),
                "vendor_id": str(vendor_id),
                **result,
            },
            upsert=True,
        )
        await append_job_log(job_id, "Saved evaluation results to MongoDB")

        await update_job(job_id, status="completed", progress=100, current_step="Completed")
        await append_job_log(job_id, "Evaluation completed")
    except Exception as e:
        await append_job_log(job_id, f"Job failed: {e}", level="error")
        await append_job_log(job_id, traceback.format_exc(), level="error")
        await update_job(job_id, status="failed", current_step="Failed")
