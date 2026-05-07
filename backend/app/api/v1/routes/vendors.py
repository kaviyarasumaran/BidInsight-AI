from __future__ import annotations

from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from app.db.mongo import get_mongo_db
from app.db.postgres import get_session
from app.models.submission import VendorSubmission
from app.models.vendor import Vendor
from app.schemas.vendors import (
    EvidenceResponse,
    VendorCreateRequest,
    VendorCreateResponse,
    VendorDetailResponse,
    VendorSubmissionResponse,
)
from app.services.audit_service import audit_log
from app.services.file_ingestion import new_upload_id, save_upload_files
from app.services.job_service import append_job_log, init_job, new_job_id, update_job
from app.services.queue import enqueue_evidence_extraction

router = APIRouter()


@router.post("", response_model=VendorCreateResponse)
async def create_vendor(payload: VendorCreateRequest, session: AsyncSession = Depends(get_session)):
    vendor = Vendor(vendor_name=payload.vendor_name, gst_number=payload.gst_number, contact_info=payload.contact_info)
    session.add(vendor)
    try:
        await session.commit()
        await session.refresh(vendor)
        await audit_log(session, entity_type="vendor", entity_id=str(vendor.id), event_type="vendor_created")
    except SQLAlchemyError:
        await session.rollback()
        raise HTTPException(status_code=503, detail="PostgreSQL unavailable. Start Postgres or update POSTGRES_DSN.")
    return {"vendor_id": vendor.id}


@router.get("/{vendor_id}", response_model=VendorDetailResponse)
async def get_vendor(vendor_id: UUID, session: AsyncSession = Depends(get_session)):
    vendor = await session.get(Vendor, vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="vendor not found")
    return {
        "vendor_id": vendor.id,
        "vendor_name": vendor.vendor_name,
        "gst_number": vendor.gst_number,
        "contact_info": vendor.contact_info,
    }


@router.post("/{vendor_id}/submission", response_model=VendorSubmissionResponse)
async def upload_vendor_submission(
    vendor_id: UUID,
    tender_id: UUID | None = Form(default=None),
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

    vendor = await session.get(Vendor, vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="vendor not found")

    upload_id = new_upload_id()
    saved_files: list[dict] = []
    if files:
        saved_files = await save_upload_files(upload_id, files)

    job_id = new_job_id()
    await init_job(job_id, "evidence_extraction")
    await update_job(job_id, current_step="Input received", progress=1)
    await update_job(job_id, vendor_id=str(vendor_id), tender_id=str(tender_id) if tender_id else "")
    await append_job_log(job_id, f"Submission received for vendor {vendor_id}")

    submission = VendorSubmission(
        vendor_id=vendor_id,
        tender_id=tender_id,
        upload_id=upload_id,
        processing_job_id=job_id,
    )
    session.add(submission)
    await session.commit()
    await session.refresh(submission)

    await audit_log(
        session,
        entity_type="submission",
        entity_id=str(submission.id),
        event_type="vendor_submission_uploaded",
        payload={"vendor_id": str(vendor_id), "tender_id": str(tender_id) if tender_id else None, "upload_id": upload_id},
    )

    await enqueue_evidence_extraction(job_id=job_id, vendor_id=vendor_id, tender_id=tender_id, raw_text=raw_text, files=saved_files)

    return {"submission_id": submission.id, "processing_job_id": job_id}


@router.get("/{vendor_id}/evidence", response_model=EvidenceResponse)
async def get_vendor_evidence(vendor_id: UUID, tender_id: UUID | None = None):
    doc = await get_mongo_db().vendor_evidence.find_one({"vendor_id": str(vendor_id), "tender_id": str(tender_id) if tender_id else None})
    if not doc:
        return {"vendor_id": vendor_id, "tender_id": tender_id, "evidence": []}
    return {"vendor_id": vendor_id, "tender_id": tender_id, "evidence": doc.get("evidence", [])}
