from __future__ import annotations

from app.nodes.job_node import job_update, stage_update


async def human_review_check_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="Manual Review Detection", stage_status="processing")
        await job_update(job_id=job_id, progress=90, current_step="Review node: deciding manual review requirement", estimated_next_step="Persisting results")

    overall = ((state.get("confidence") or {}).get("overall")) or 0.0
    needs = overall < 0.7
    if job_id:
        await stage_update(
            job_id=job_id,
            stage_name="Manual Review Detection",
            stage_status="completed",
        )
    return {"needs_review": needs}
