from __future__ import annotations

from app.nodes.job_node import job_update, stage_update
from app.services.criteria_engine import normalize_criteria
from app.core.llm.factory import get_llm
from app.services.preview_service import upsert_live_preview


CRITERIA_SCHEMA_HINT = """[{ "criterion": "string", "category": "string", "mandatory": true, "operator": ">=", "value": "string", "unit": "string" }]"""


async def criteria_extraction_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="LLM Extraction", stage_status="processing")
        await job_update(job_id=job_id, progress=60, current_step="Criteria node: extracting criteria (LLM)", estimated_next_step="Normalization")

    combined = ((state.get("parsed") or {}).get("combined_text")) or ""
    llm = get_llm()
    extracted = await llm.generate_json(
        system=(
            "You extract tender eligibility criteria and key metadata from procurement text. "
            "IMPORTANT: Always look for and extract key dates such as 'Submission Deadline', 'Closing Date', 'Clarification Deadline', and 'Project Start/End Dates'."
        ),
        user=f"Extract criteria and key dates from this text:\n\n{combined[:10000]}",
        schema_hint=CRITERIA_SCHEMA_HINT,
    )
    # Accept either {criteria:[...]} or bare [...]
    criteria = extracted.get("criteria") if isinstance(extracted, dict) else None
    if criteria is None and isinstance(extracted, dict) and "data" in extracted:
        criteria = extracted.get("data")
    if criteria is None and isinstance(extracted, list):
        criteria = extracted
    if not isinstance(criteria, list):
        criteria = []
    criteria = await normalize_criteria(criteria)
    if job_id:
        await upsert_live_preview(
            job_id=job_id,
            payload={
                "detected_criteria": [
                    {"criterion": c.get("text") or c.get("criterion"), "status": "detected", "source": (c.get("source") or {}).get("page")}
                    for c in criteria[:25]
                ],
                "warnings": [],
            },
        )
        await stage_update(job_id=job_id, stage_name="LLM Extraction", stage_status="completed")
    return {"criteria": criteria}
