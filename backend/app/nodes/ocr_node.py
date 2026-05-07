from __future__ import annotations

from app.nodes.job_node import job_update, stage_update
from app.nodes.types import TenderState, VendorState
from app.services.ocr_service import run_ocr
from app.services.preview_service import upsert_live_preview


from app.db.mongo import get_mongo_db

async def ocr_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    tender_id = state.get("tender_id")
    
    if job_id:
        await stage_update(job_id=job_id, stage_name="OCR Processing", stage_status="processing")
        await job_update(job_id=job_id, progress=15, current_step="OCR node: running OCR", estimated_next_step="Parsing documents")
    
    ocr = await run_ocr(files=state.get("files", []))
    
    # If no files were processed but raw_text exists, use it as the OCR text
    if not ocr.get("text") and state.get("raw_text"):
        ocr["text"] = state.get("raw_text")
        ocr["ocr_engine"] = "raw_text_input"

    # Save OCR output to MongoDB for UI retrieval
    if tender_id:
        try:
            t_id = str(tender_id)
            mongo = get_mongo_db()
            await mongo.tender_ocr.update_one(
                {"tender_id": t_id},
                {"$set": {
                    "tender_id": t_id,
                    "job_id": job_id,
                    "text": ocr.get("text"),
                    "pages": ocr.get("pages"),
                    "engine": ocr.get("ocr_engine")
                }},
                upsert=True
            )
        except Exception:
            pass

    if job_id:
        await upsert_live_preview(
            job_id=job_id,
            payload={
                "detected_criteria": [
                    {"criterion": f"Processed {len(ocr.get('pages', []))} pages", "status": "OCR Completed", "source": "System"}
                ],
                "warnings": ocr.get("warnings", []) if hasattr(ocr, "get") else [],
            },
        )
        await stage_update(job_id=job_id, stage_name="OCR Processing", stage_status="completed")
    return {"ocr": ocr}
