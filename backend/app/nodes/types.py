from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, TypedDict
from uuid import UUID


class JobCtx(TypedDict, total=False):
    job_id: str
    job_type: str


class TenderState(TypedDict, total=False):
    job: JobCtx
    tender_id: str
    raw_text: str | None
    files: list[dict]
    ocr: dict
    parsed: dict
    criteria: list[dict]
    context: dict
    confidence: dict
    needs_review: bool
    summary: dict


class VendorState(TypedDict, total=False):
    job: JobCtx
    vendor_id: str
    tender_id: str | None
    raw_text: str | None
    files: list[dict]
    ocr: dict
    parsed: dict
    evidence: list[dict]
    confidence: dict
    needs_review: bool


class EvaluationState(TypedDict, total=False):
    job: JobCtx
    evaluation_id: str
    tender_id: str
    vendor_id: str
    criteria: list[dict]
    evidence: list[dict]
    result: dict
