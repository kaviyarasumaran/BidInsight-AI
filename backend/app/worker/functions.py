from __future__ import annotations

from uuid import UUID

from app.services.job_service import append_job_log
from app.workflows.evidence_extraction import run_evidence_extraction_job
from app.workflows.evaluation import run_evaluation_job
from app.workflows.tender_extraction import run_tender_extraction_job


async def tender_extraction(ctx, job_id: str, tender_id: str, raw_text: str | None, files: list[dict]):
    await append_job_log(job_id, "Worker picked up tender_extraction")
    await run_tender_extraction_job(job_id=job_id, tender_id=UUID(tender_id), raw_text=raw_text, files=files)


async def evidence_extraction(ctx, job_id: str, vendor_id: str, tender_id: str | None, raw_text: str | None, files: list[dict]):
    await append_job_log(job_id, "Worker picked up evidence_extraction")
    await run_evidence_extraction_job(
        job_id=job_id,
        vendor_id=UUID(vendor_id),
        tender_id=UUID(tender_id) if tender_id else None,
        raw_text=raw_text,
        files=files,
    )


async def evaluation(ctx, job_id: str, evaluation_id: str, tender_id: str, vendor_id: str):
    await append_job_log(job_id, "Worker picked up evaluation")
    await run_evaluation_job(job_id=job_id, evaluation_id=UUID(evaluation_id), tender_id=UUID(tender_id), vendor_id=UUID(vendor_id))
