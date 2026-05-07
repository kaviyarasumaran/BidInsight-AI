from __future__ import annotations

import traceback
from uuid import UUID

from app.db.mongo import get_mongo_db
from app.graphs.tender_graph import build_tender_graph
from app.services.job_service import append_job_log, update_job


async def run_tender_extraction_job(*, job_id: str, tender_id: UUID, raw_text: str | None, files: list[dict]) -> None:
    try:
        await update_job(job_id, status="processing", progress=5, current_step="Starting tender workflow (LangGraph)")
        await append_job_log(job_id, "Tender extraction started")

        graph = build_tender_graph()
        final_state = await graph.ainvoke({"job": {"job_id": job_id, "job_type": "tender_extraction"}, "tender_id": str(tender_id), "raw_text": raw_text, "files": files})
        criteria = final_state.get("criteria", [])
        summary = final_state.get("summary", {})
        needs_review = bool(final_state.get("needs_review"))

        db = get_mongo_db()
        await db.tender_criteria.replace_one(
            {"tender_id": str(tender_id)},
            {"tender_id": str(tender_id), "criteria": criteria, "needs_review": needs_review},
            upsert=True,
        )
        
        if summary:
            await db.tender_summaries.replace_one(
                {"tender_id": str(tender_id)},
                {"tender_id": str(tender_id), "summary": summary},
                upsert=True,
            )
        
        await append_job_log(job_id, "Saved criteria and summary to MongoDB")

        await update_job(
            job_id,
            status="completed",
            progress=100,
            current_step="Completed (low confidence)" if needs_review else "Completed",
        )
        await append_job_log(job_id, "Tender extraction completed")
    except Exception as e:
        await append_job_log(job_id, f"Job failed: {e}", level="error")
        await append_job_log(job_id, traceback.format_exc(), level="error")
        await update_job(job_id, status="failed", current_step="Failed")
