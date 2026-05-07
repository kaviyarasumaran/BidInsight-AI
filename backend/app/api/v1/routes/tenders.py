from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.db.postgres import get_session
from app.db.mongo import get_mongo_db
from app.models.enums import TenderStatus
from app.models.tender import Tender
from app.schemas.tenders import (
    CriteriaResponse,
    CriterionPatchRequest,
    TenderCreateRequest,
    TenderCreateResponse,
    TenderDetailResponse,
    TenderInputResponse,
)
from app.services.audit_service import audit_log
from app.services.file_ingestion import new_upload_id, save_upload_files
from app.services.job_service import append_job_log, init_job, new_job_id, update_job
from app.services.queue import enqueue_tender_extraction

router = APIRouter()


@router.post("", response_model=TenderCreateResponse)
async def create_tender(payload: TenderCreateRequest, session: AsyncSession = Depends(get_session)):
    tender = Tender(
        tender_title=payload.tender_title,
        department=payload.department,
        description=payload.description,
        created_by=payload.created_by,
        status=TenderStatus.draft.value,
    )
    session.add(tender)
    try:
      await session.commit()
      await session.refresh(tender)
      await audit_log(session, entity_type="tender", entity_id=str(tender.id), event_type="tender_created", actor=payload.created_by)
    except SQLAlchemyError:
      await session.rollback()
      raise HTTPException(status_code=503, detail="PostgreSQL unavailable. Start Postgres or update POSTGRES_DSN.")
    return {"tender_id": tender.id, "status": tender.status}


@router.post("/{tender_id}/input", response_model=TenderInputResponse)
async def upload_tender_input(
    tender_id: UUID,
    raw_text: str | None = Form(
        default=None,
        description="Optional plain text input. Provide this and/or files[]. At least one of them is required.",
    ),
    files: List[UploadFile] | None = File(
        default=None,
        description="Optional uploaded files (PDF/DOC/DOCX/images). Provide this and/or raw_text.",
        json_schema_extra={"type": "array", "items": {"type": "string", "format": "binary"}},
    ),
    session: AsyncSession = Depends(get_session),
):
    if not raw_text and not files:
        raise HTTPException(status_code=400, detail="Provide raw_text and/or files[]")

    tender = await session.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="tender not found")

    upload_id = new_upload_id()
    saved_files: list[dict] = []
    if files:
        saved_files = await save_upload_files(upload_id, files)

    job_id = new_job_id()
    await init_job(job_id, "tender_extraction")
    await update_job(job_id, current_step="Input received", progress=1)
    await update_job(job_id, tender_id=str(tender_id))
    await append_job_log(job_id, f"Input received for tender {tender_id}")

    tender.latest_job_id = job_id
    tender.status = TenderStatus.processing.value
    await session.commit()
    await audit_log(
        session,
        entity_type="tender",
        entity_id=str(tender_id),
        event_type="tender_input_uploaded",
        payload={"upload_id": upload_id, "files": [f.get("filename") for f in saved_files], "has_raw_text": bool(raw_text)},
    )

    await enqueue_tender_extraction(job_id=job_id, tender_id=tender_id, raw_text=raw_text, files=saved_files)

    return {"upload_id": upload_id, "processing_job_id": job_id}


@router.get("/{tender_id}", response_model=TenderDetailResponse)
async def get_tender(tender_id: UUID, session: AsyncSession = Depends(get_session)):
    tender = await session.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="tender not found")

    criteria_doc = await get_mongo_db().tender_criteria.find_one({"tender_id": str(tender_id)})
    summary = None
    if criteria_doc:
        summary = {"count": len(criteria_doc.get("criteria", []))}

    return {
        "tender_id": tender.id,
        "tender_title": tender.tender_title,
        "department": tender.department,
        "description": tender.description,
        "created_by": tender.created_by,
        "status": tender.status,
        "latest_job_id": tender.latest_job_id,
        "criteria_summary": summary,
    }


@router.get("/{tender_id}/criteria", response_model=CriteriaResponse)
async def get_tender_criteria(tender_id: UUID):
    doc = await get_mongo_db().tender_criteria.find_one({"tender_id": str(tender_id)})
    if not doc:
        return {"tender_id": tender_id, "criteria": []}
    return {"tender_id": tender_id, "criteria": doc.get("criteria", [])}


@router.get("/{tender_id}/ocr")
async def get_tender_ocr(tender_id: UUID):
    db = get_mongo_db()
    doc = await db.tender_ocr.find_one({"tender_id": str(tender_id)})
    if not doc:
        return {"tender_id": tender_id, "text": "", "pages": []}
    doc.pop("_id", None)
    return doc


@router.get("/{tender_id}/document-summary")
async def tender_document_summary(tender_id: UUID):
    db = get_mongo_db()
    
    # Try to get the rich summary first
    summary_doc = await db.tender_summaries.find_one({"tender_id": str(tender_id)})
    if summary_doc and "summary" in summary_doc:
        return summary_doc["summary"]

    # Fallback to basic summary if rich summary is not yet generated
    doc = await db.tender_criteria.find_one({"tender_id": str(tender_id)}) or {}
    criteria = doc.get("criteria", []) or []
    total = len(criteria)
    mandatory = len([c for c in criteria if (c.get("mandatory") is True) or ("mandatory" not in c)])
    optional = total - mandatory
    confs = [c.get("confidence") for c in criteria if isinstance(c.get("confidence"), (int, float))]
    overall_conf = int(round((sum(confs) / len(confs)) * 100)) if confs else 0
    return {
        "summary": {
            "total_criteria": total,
            "mandatory": mandatory,
            "optional": optional,
            "overall_confidence": overall_conf,
            "risk_flags": 0,
        }
    }


@router.patch("/{tender_id}/criteria/{criterion_id}")
async def patch_criterion(tender_id: UUID, criterion_id: str, payload: CriterionPatchRequest):
    db = get_mongo_db()
    doc = await db.tender_criteria.find_one({"tender_id": str(tender_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="criteria not found")

    criteria: list[dict] = doc.get("criteria", [])
    found = False
    for c in criteria:
        if c.get("criterion_id") == criterion_id:
            found = True
            if payload.text is not None:
                c["text"] = payload.text
            if payload.category is not None:
                c["category"] = payload.category
            if payload.mandatory is not None:
                c["mandatory"] = payload.mandatory
            if payload.approved is not None:
                c["approved"] = payload.approved
            break
    if not found:
        raise HTTPException(status_code=404, detail="criterion not found")

    await db.tender_criteria.replace_one({"tender_id": str(tender_id)}, {"tender_id": str(tender_id), "criteria": criteria}, upsert=True)
    return {"status": "ok"}
@router.post("/{tender_id}/regenerate")
async def regenerate_tender(tender_id: UUID, session: AsyncSession = Depends(get_session)):
    tender = await session.get(Tender, tender_id)
    if not tender:
        raise HTTPException(status_code=404, detail="tender not found")

    # Fetch last input from audit logs or document_chunks to find files
    # For now, we'll try to find chunks to see if we have files
    db = get_mongo_db()
    ocr_doc = await db.tender_ocr.find_one({"tender_id": str(tender_id)})
    
    # We need the original files and raw_text. 
    # In a real app, these should be stored in a 'TenderInput' model.
    # For now, we'll use a placeholder or look for files in storage if we can.
    # To keep it simple and robust, we'll check the latest audit log for this tender
    from app.models.audit import AuditEvent
    stmt = select(AuditEvent).where(AuditEvent.entity_id == str(tender_id), AuditEvent.event_type == "tender_input_uploaded").order_by(AuditEvent.created_at.desc())
    res = await session.execute(stmt)
    log = res.scalars().first()
    
    if not log:
        raise HTTPException(status_code=400, detail="No previous input found to regenerate from")

    payload = log.payload or {}
    upload_id = payload.get("upload_id")
    # Re-construct saved_files if possible
    saved_files = []
    if upload_id:
        from pathlib import Path
        storage_dir = Path(settings.local_storage_path) / upload_id
        if storage_dir.exists():
            for f in storage_dir.iterdir():
                if f.is_file():
                    saved_files.append({"filename": f.name, "path": str(f)})

    job_id = new_job_id()
    await init_job(job_id, "tender_extraction")
    await update_job(job_id, current_step="Regeneration started", progress=1, tender_id=str(tender_id))
    
    tender.latest_job_id = job_id
    tender.status = TenderStatus.processing.value
    await session.commit()

    await enqueue_tender_extraction(
        job_id=job_id, 
        tender_id=tender_id, 
        raw_text=None, # Assuming files for now
        files=saved_files
    )

    return {"processing_job_id": job_id}

@router.get("/{tender_id}/report")
async def download_tender_report(tender_id: UUID):
    db = get_mongo_db()
    summary_doc = await db.tender_summaries.find_one({"tender_id": str(tender_id)})
    if not summary_doc or "summary" not in summary_doc:
        raise HTTPException(status_code=404, detail="Summary not ready. Please complete the extraction first.")

    from app.services.report_service import generate_evaluation_pdf
    from fastapi.responses import FileResponse
    import tempfile

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        output_path = tmp.name
    
    generate_evaluation_pdf(summary_doc["summary"], output_path)
    
    return FileResponse(
        output_path, 
        media_type="application/pdf", 
        filename=f"BidInsight_Report_{tender_id}.pdf"
    )

from typing import List
