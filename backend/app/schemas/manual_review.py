from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


class ManualReviewListItem(BaseModel):
    review_id: UUID
    tender_id: str
    vendor_id: str | None
    priority: int
    status: str
    summary: str


class ManualReviewListResponse(BaseModel):
    items: list[ManualReviewListItem]


class ManualReviewDetailResponse(BaseModel):
    review_id: UUID
    tender_id: str
    vendor_id: str | None
    priority: int
    status: str
    summary: str
    details: dict | None


class ManualReviewDecisionRequest(BaseModel):
    action: str = Field(pattern="^(approve|reject|override)$")
    officer_note: str | None = None
    corrected_value: str | None = None
    reviewed_by: str | None = None
