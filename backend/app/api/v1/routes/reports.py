from __future__ import annotations

from fastapi import APIRouter, Response

from app.services.report_service import generate_evaluation_pdf

router = APIRouter()


@router.get("/evaluation/{evaluation_id}")
async def evaluation_report(evaluation_id: str):
    pdf = await generate_evaluation_pdf(evaluation_id=evaluation_id)
    return Response(content=pdf, media_type="application/pdf")
