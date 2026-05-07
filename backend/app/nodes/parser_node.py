from __future__ import annotations

from app.nodes.job_node import job_update, stage_update
from app.nodes.types import TenderState, VendorState
from app.services.parser_service import parse_documents


async def parser_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="Parser Engine", stage_status="processing")
        await job_update(job_id=job_id, progress=35, current_step="Parser node: normalizing inputs", estimated_next_step="LLM extraction")
    tender_id = state.get("tender_id")
    parsed = await parse_documents(raw_text=state.get("raw_text"), ocr=state.get("ocr"), files=state.get("files", []), job_id=job_id, tender_id=tender_id)
    if job_id:
        await stage_update(job_id=job_id, stage_name="Parser Engine", stage_status="completed")
    return {"parsed": parsed}
