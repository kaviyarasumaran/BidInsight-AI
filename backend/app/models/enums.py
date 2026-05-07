from __future__ import annotations

import enum


class TenderStatus(str, enum.Enum):
    draft = "draft"
    processing = "processing"
    ready_for_review = "ready_for_review"
    active = "active"
    archived = "archived"


class JobStatus(str, enum.Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    manual_review_required = "manual_review_required"


class JobType(str, enum.Enum):
    tender_extraction = "tender_extraction"
    evidence_extraction = "evidence_extraction"
    evaluation = "evaluation"
