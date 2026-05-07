from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_session
from app.models.manual_review import ManualReviewCase
from app.schemas.manual_review import (
    ManualReviewDecisionRequest,
    ManualReviewDetailResponse,
    ManualReviewListResponse,
)
from app.services.audit_service import audit_log

router = APIRouter()


@router.get("", response_model=ManualReviewListResponse)
async def list_manual_review(
    tender_id: str | None = None,
    vendor_id: str | None = None,
    status: str | None = Query(default="open"),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(ManualReviewCase)
    if tender_id:
        stmt = stmt.where(ManualReviewCase.tender_id == tender_id)
    if vendor_id:
        stmt = stmt.where(ManualReviewCase.vendor_id == vendor_id)
    if status:
        stmt = stmt.where(ManualReviewCase.status == status)
    res = (await session.execute(stmt)).scalars().all()
    return {
        "items": [
            {
                "review_id": r.id,
                "tender_id": r.tender_id,
                "vendor_id": r.vendor_id,
                "priority": r.priority,
                "status": r.status,
                "summary": r.summary,
            }
            for r in res
        ]
    }


@router.get("/{review_id}", response_model=ManualReviewDetailResponse)
async def get_manual_review(review_id: UUID, session: AsyncSession = Depends(get_session)):
    r = await session.get(ManualReviewCase, review_id)
    if not r:
        raise HTTPException(status_code=404, detail="review not found")
    return {
        "review_id": r.id,
        "tender_id": r.tender_id,
        "vendor_id": r.vendor_id,
        "priority": r.priority,
        "status": r.status,
        "summary": r.summary,
        "details": r.details,
    }


@router.post("/{review_id}/decision")
async def decide_manual_review(review_id: UUID, payload: ManualReviewDecisionRequest, session: AsyncSession = Depends(get_session)):
    r = await session.get(ManualReviewCase, review_id)
    if not r:
        raise HTTPException(status_code=404, detail="review not found")

    old_details = r.details or {}
    old_value = old_details.get("found_value") or old_details.get("value") or old_details.get("extracted_value")

    r.officer_note = payload.officer_note
    r.status = "closed"
    r.details = {
        **old_details,
        "action": payload.action,
        "reviewed_by": payload.reviewed_by,
        "old_value": old_value,
        "new_value": payload.corrected_value if payload.action == "override" else old_value,
        "reason": old_details.get("reason") or old_details.get("trigger_reason"),
    }

    await session.commit()
    await audit_log(
        session,
        entity_type="manual_review",
        entity_id=str(review_id),
        event_type="manual_review_decision",
        payload={
            "action": payload.action,
            "reviewed_by": payload.reviewed_by,
            "old_value": old_value,
            "new_value": payload.corrected_value,
            "officer_note": payload.officer_note,
        },
    )
    return {"status": "ok"}
