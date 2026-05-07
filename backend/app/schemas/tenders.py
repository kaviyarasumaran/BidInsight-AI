from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.jobs import JobStatusResponse


class TenderCreateRequest(BaseModel):
    tender_title: str = Field(min_length=1, max_length=300)
    department: str = Field(min_length=1, max_length=200)
    description: str | None = None
    created_by: str = Field(min_length=1, max_length=120)


class TenderCreateResponse(BaseModel):
    tender_id: UUID
    status: str


class TenderDetailResponse(BaseModel):
    tender_id: UUID
    tender_title: str
    department: str
    description: str | None
    created_by: str
    status: str
    latest_job_id: str | None
    criteria_summary: dict | None = None


class TenderInputResponse(BaseModel):
    upload_id: str
    processing_job_id: str


class Criterion(BaseModel):
    criterion_id: str
    text: str
    category: str | None = None
    mandatory: bool = True
    confidence: float | None = None
    source: dict | None = None


class CriteriaResponse(BaseModel):
    tender_id: UUID
    criteria: list[Criterion]


class CriterionPatchRequest(BaseModel):
    text: str | None = None
    category: str | None = None
    mandatory: bool | None = None
    approved: bool | None = None
