from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel


class EvaluationRunRequest(BaseModel):
    tender_id: UUID
    vendor_id: UUID


class EvaluationRunResponse(BaseModel):
    evaluation_id: UUID
    evaluation_job_id: str


class EvaluationResultResponse(BaseModel):
    evaluation_id: UUID
    tender_id: UUID
    vendor_id: UUID
    overall_verdict: str | None = None
    score: float | None = None
    confidence: float | None = None


class CriterionEvaluation(BaseModel):
    criterion_id: str
    criterion: str
    required_value: str | None = None
    found_evidence: str | None = None
    source_document: str | None = None
    page_number: int | None = None
    confidence: float | None = None
    verdict: str | None = None
    reason: str | None = None


class EvaluationCriteriaResponse(BaseModel):
    evaluation_id: UUID
    criteria: list[CriterionEvaluation]
