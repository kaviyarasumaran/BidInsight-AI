from __future__ import annotations

import traceback
from uuid import UUID

from app.db.mongo import get_mongo_db
from app.graphs.vendor_graph import build_vendor_graph
from app.services.job_service import append_job_log, update_job


async def run_evidence_extraction_job(
    *,
    job_id: str,
    vendor_id: UUID,
    tender_id: UUID | None,
    raw_text: str | None,
    files: list[dict],
) -> None:
    try:
        await update_job(job_id, status="processing", progress=5, current_step="Starting vendor workflow (LangGraph)")
        await append_job_log(job_id, "Evidence extraction started")

        graph = build_vendor_graph()
        final_state = await graph.ainvoke(
            {"job": {"job_id": job_id, "job_type": "evidence_extraction"}, "vendor_id": str(vendor_id), "tender_id": str(tender_id) if tender_id else None, "raw_text": raw_text, "files": files}
        )
        evidence = final_state.get("evidence", [])
        needs_review = bool(final_state.get("needs_review"))

        db = get_mongo_db()
        await db.vendor_evidence.replace_one(
            {"vendor_id": str(vendor_id), "tender_id": str(tender_id) if tender_id else None},
            {
                "vendor_id": str(vendor_id),
                "tender_id": str(tender_id) if tender_id else None,
                "evidence": evidence,
                "needs_review": needs_review,
            },
            upsert=True,
        )
        await append_job_log(job_id, "Saved evidence to MongoDB")

        await update_job(
            job_id,
            status="completed",
            progress=100,
            current_step="Completed (low confidence)" if needs_review else "Completed",
        )
        await append_job_log(job_id, "Evidence extraction completed")
    except Exception as e:
        await append_job_log(job_id, f"Job failed: {e}", level="error")
        await append_job_log(job_id, traceback.format_exc(), level="error")
        await update_job(job_id, status="failed", current_step="Failed")
