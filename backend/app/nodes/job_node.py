from __future__ import annotations

from app.services.job_service import append_job_log, update_job
from app.services.stage_service import set_stage


async def job_update(*, job_id: str, progress: int, current_step: str, estimated_next_step: str | None = None) -> None:
    await update_job(job_id, status="processing", progress=progress, current_step=current_step, estimated_next_step=estimated_next_step)
    await append_job_log(job_id, current_step)


async def stage_update(*, job_id: str, stage_name: str, stage_status: str) -> None:
    await set_stage(job_id, name=stage_name, status=stage_status)
