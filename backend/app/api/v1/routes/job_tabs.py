from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.services.job_service import get_job_status
from app.services.preview_service import get_live_preview
from app.services.stage_service import get_computer_status

router = APIRouter()


@router.get("/{job_id}/computer-status")
async def computer_status(job_id: str):
    status = await get_job_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="job not found")
    overall_progress = int(status.get("progress") or 0)
    current_stage = status.get("current_step") or ""
    return await get_computer_status(job_id, overall_progress=overall_progress, current_stage=current_stage)


@router.get("/{job_id}/live-preview")
async def live_preview(job_id: str):
    doc = await get_live_preview(job_id=job_id)
    if not doc:
        return {"detected_criteria": [], "warnings": []}
    return {
        "detected_criteria": doc.get("detected_criteria", []),
        "warnings": doc.get("warnings", []),
    }
