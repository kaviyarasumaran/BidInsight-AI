from __future__ import annotations

import asyncio

from arq.connections import RedisSettings, create_pool

from app.config import settings
from app.workflows.evidence_extraction import run_evidence_extraction_job
from app.workflows.evaluation import run_evaluation_job
from app.workflows.tender_extraction import run_tender_extraction_job


async def _run_with_logging(coro, job_id: str):
    try:
        await coro
    except Exception as e:
        from app.services.job_service import update_job, append_job_log
        import traceback
        await append_job_log(job_id, f"Queue task failed: {str(e)}", level="error")
        await append_job_log(job_id, traceback.format_exc(), level="error")
        await update_job(job_id, status="failed", current_step="Queue task error")

async def enqueue_tender_extraction(*, job_id: str, tender_id, raw_text: str | None, files: list[dict]) -> None:
    if settings.queue_backend == "arq":
        redis = await create_pool(RedisSettings.from_dsn(settings.redis_dsn))
        try:
            await redis.enqueue_job("tender_extraction", job_id, str(tender_id), raw_text, files)
        finally:
            redis.close()
        return
    asyncio.create_task(_run_with_logging(
        run_tender_extraction_job(job_id=job_id, tender_id=tender_id, raw_text=raw_text, files=files),
        job_id
    ))


async def enqueue_evidence_extraction(*, job_id: str, vendor_id, tender_id, raw_text: str | None, files: list[dict]) -> None:
    if settings.queue_backend == "arq":
        redis = await create_pool(RedisSettings.from_dsn(settings.redis_dsn))
        try:
            await redis.enqueue_job("evidence_extraction", job_id, str(vendor_id), str(tender_id) if tender_id else None, raw_text, files)
        finally:
            redis.close()
        return
    asyncio.create_task(_run_with_logging(
        run_evidence_extraction_job(job_id=job_id, vendor_id=vendor_id, tender_id=tender_id, raw_text=raw_text, files=files),
        job_id
    ))


async def enqueue_evaluation(*, job_id: str, evaluation_id, tender_id, vendor_id) -> None:
    if settings.queue_backend == "arq":
        redis = await create_pool(RedisSettings.from_dsn(settings.redis_dsn))
        try:
            await redis.enqueue_job("evaluation", job_id, str(evaluation_id), str(tender_id), str(vendor_id))
        finally:
            redis.close()
        return
    asyncio.create_task(_run_with_logging(
        run_evaluation_job(job_id=job_id, evaluation_id=evaluation_id, tender_id=tender_id, vendor_id=vendor_id),
        job_id
    ))
