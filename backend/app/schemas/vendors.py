from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field


class VendorCreateRequest(BaseModel):
    vendor_name: str = Field(min_length=1, max_length=300)
    gst_number: str | None = Field(default=None, max_length=32)
    contact_info: str | None = None


class VendorCreateResponse(BaseModel):
    vendor_id: UUID


class VendorDetailResponse(BaseModel):
    vendor_id: UUID
    vendor_name: str
    gst_number: str | None
    contact_info: str | None


class VendorSubmissionResponse(BaseModel):
    submission_id: UUID
    processing_job_id: str


class EvidenceObject(BaseModel):
    key: str
    value: str | float | int | None
    confidence: float | None = None
    sources: list[dict] = []


class EvidenceResponse(BaseModel):
    vendor_id: UUID
    tender_id: UUID | None = None
    evidence: list[EvidenceObject]
