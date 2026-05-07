from __future__ import annotations

from app.nodes.job_node import job_update, stage_update
from app.core.llm.factory import get_llm
from app.db.mongo import get_mongo_db


CONTEXT_SCHEMA_HINT = """{
  "scope_of_work": "string",
  "department": "string",
  "project_summary": "string",
  "financial_clauses": ["string"],
  "technical_clauses": ["string"],
  "compliance_clauses": ["string"],
  "general_notes": ["string"]
}"""


async def context_builder_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    tender_id = state.get("tender_id")
    
    if job_id:
        await stage_update(job_id=job_id, stage_name="Context Builder", stage_status="processing")
        await job_update(job_id=job_id, progress=75, current_step="Context node: building semantic memory", estimated_next_step="Confidence Assessment")

    combined = ((state.get("parsed") or {}).get("combined_text")) or ""
    llm = get_llm()
    
    extracted = await llm.generate_json(
        system=(
            "You are a Tender Intelligence Specialist. "
            "Extract the high-level semantic context from the tender document. "
            "Focus on the scope of work, issuing department, and key clauses."
        ),
        user=f"Build a semantic summary for this tender:\n\n{combined[:10000]}",
        schema_hint=CONTEXT_SCHEMA_HINT,
    )
    
    context = extracted if isinstance(extracted, dict) else {}
    
    # Save to MongoDB for the agent to use
    if tender_id:
        try:
            t_id = str(tender_id)
            mongo = get_mongo_db()
            await mongo.tender_context.update_one(
                {"tender_id": t_id},
                {"$set": {**context, "job_id": job_id}},
                upsert=True
            )
        except Exception:
            pass

    if job_id:
        await stage_update(job_id=job_id, stage_name="Context Builder", stage_status="completed")
        
    return {"context": context}
