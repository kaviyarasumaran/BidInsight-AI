from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.schemas.jobs import JobLogsResponse, JobStatusResponse
from app.services.job_service import get_job_logs_page, get_job_status

router = APIRouter()


@router.get("/{job_id}/status", response_model=JobStatusResponse)
async def job_status(job_id: str):
    data = await get_job_status(job_id)
    if not data:
        raise HTTPException(status_code=404, detail="job not found")
    return {
        "job_id": data.get("job_id", job_id),
        "type": data.get("type", "unknown"),
        "status": data.get("status", "queued"),
        "progress": int(data.get("progress") or 0),
        "current_step": data.get("current_step") or None,
        "estimated_next_step": data.get("estimated_next_step") or None,
    }


@router.get("/{job_id}/logs", response_model=JobLogsResponse)
async def job_logs(
    job_id: str,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=500),
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
):
    newest_first = order == "desc"
    total, lines = await get_job_logs_page(job_id, offset=offset, limit=limit, newest_first=newest_first)
    return {"job_id": job_id, "total": total, "offset": offset, "limit": limit, "lines": lines}
