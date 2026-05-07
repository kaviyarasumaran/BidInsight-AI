from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from app.db.mongo import get_mongo_db
from app.db.postgres import get_session
from app.models.evaluation import Evaluation
from app.schemas.evaluations import (
    EvaluationCriteriaResponse,
    EvaluationResultResponse,
    EvaluationRunRequest,
    EvaluationRunResponse,
)
from app.services.audit_service import audit_log
from app.services.job_service import append_job_log, init_job, new_job_id, update_job
from app.services.queue import enqueue_evaluation

router = APIRouter()


@router.post("/run", response_model=EvaluationRunResponse)
async def run_eval(payload: EvaluationRunRequest, session: AsyncSession = Depends(get_session)):
    job_id = new_job_id()
    await init_job(job_id, "evaluation")
    await update_job(job_id, current_step="Input received", progress=1)
    await append_job_log(job_id, f"Evaluation requested tender={payload.tender_id} vendor={payload.vendor_id}")

    evaluation = Evaluation(tender_id=payload.tender_id, vendor_id=payload.vendor_id, evaluation_job_id=job_id, status="processing")
    session.add(evaluation)
    try:
        await session.commit()
        await session.refresh(evaluation)
    except SQLAlchemyError:
        await session.rollback()
        raise HTTPException(status_code=503, detail="PostgreSQL unavailable. Start Postgres or update POSTGRES_DSN.")

    await audit_log(
        session,
        entity_type="evaluation",
        entity_id=str(evaluation.id),
        event_type="evaluation_started",
        payload={"tender_id": str(payload.tender_id), "vendor_id": str(payload.vendor_id), "job_id": job_id},
    )
    await update_job(job_id, evaluation_id=str(evaluation.id), tender_id=str(payload.tender_id), vendor_id=str(payload.vendor_id))

    await enqueue_evaluation(job_id=job_id, evaluation_id=evaluation.id, tender_id=payload.tender_id, vendor_id=payload.vendor_id)

    return {"evaluation_id": evaluation.id, "evaluation_job_id": job_id}


@router.get("/{evaluation_id}", response_model=EvaluationResultResponse)
async def get_evaluation(evaluation_id: UUID, session: AsyncSession = Depends(get_session)):
    evaluation = await session.get(Evaluation, evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="evaluation not found")

    doc = await get_mongo_db().evaluation_results.find_one({"evaluation_id": str(evaluation_id)}) or {}
    return {
        "evaluation_id": evaluation.id,
        "tender_id": evaluation.tender_id,
        "vendor_id": evaluation.vendor_id,
        "overall_verdict": doc.get("overall_verdict"),
        "score": doc.get("score"),
        "confidence": doc.get("confidence"),
    }


@router.get("/{evaluation_id}/criteria", response_model=EvaluationCriteriaResponse)
async def get_evaluation_criteria(evaluation_id: UUID):
    doc = await get_mongo_db().evaluation_results.find_one({"evaluation_id": str(evaluation_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="evaluation results not found")
    return {"evaluation_id": evaluation_id, "criteria": doc.get("criteria_breakdown", [])}
