from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


JobStatus = Literal["queued", "processing", "completed", "failed", "manual_review_required"]


class JobStatusResponse(BaseModel):
    job_id: str
    type: str
    status: JobStatus
    progress: int = Field(ge=0, le=100)
    current_step: str | None = None
    estimated_next_step: str | None = None


class JobLogLine(BaseModel):
    ts: str
    level: str
    message: str


class JobLogsResponse(BaseModel):
    job_id: str
    total: int
    offset: int
    limit: int
    lines: list[JobLogLine]
