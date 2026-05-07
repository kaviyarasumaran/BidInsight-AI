from __future__ import annotations

from app.nodes.job_node import job_update
from app.services.evidence_engine import extract_evidence


async def evidence_extraction_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await job_update(job_id=job_id, progress=65, current_step="Evidence node: extracting entities/evidence", estimated_next_step="Confidence scoring")
    combined = ((state.get("parsed") or {}).get("combined_text")) or ""
    evidence = await extract_evidence(combined_text=combined)
    return {"evidence": evidence}
