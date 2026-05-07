from __future__ import annotations

from app.nodes.job_node import job_update, stage_update


async def confidence_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="Confidence Scoring", stage_status="processing")
        await job_update(job_id=job_id, progress=80, current_step="Confidence node: scoring confidence", estimated_next_step="Human review check")

    # Placeholder scoring. Real logic: OCR_conf * extraction_conf * semantic_conf
    confidence = {"overall": 0.65}
    if job_id:
        await stage_update(job_id=job_id, stage_name="Confidence Scoring", stage_status="completed")
    return {"confidence": confidence}
