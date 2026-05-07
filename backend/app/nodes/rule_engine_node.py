from __future__ import annotations
from app.nodes.job_node import job_update, stage_update
from app.core.llm.factory import get_llm

RULE_ENGINE_SCHEMA_HINT = """{
  "overall_verdict": "Eligible | Not Eligible | Needs Manual Review",
  "score": 0.85,
  "confidence": 0.9,
  "criteria_breakdown": [
    {
      "criterion_id": "string",
      "status": "Pass | Fail | Review",
      "reason": "string",
      "evidence_found": "string"
    }
  ]
}"""

async def rule_engine_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="Rule Engine Validation", stage_status="processing")
        await job_update(job_id=job_id, progress=50, current_step="Rule Engine: validating compliance rules")

    criteria = state.get("criteria", [])
    evidence = state.get("evidence", [])
    
    # Format context for LLM
    criteria_text = "\n".join([f"- [{c.get('criterion_id', 'id')}] {c.get('criterion_name', c.get('text', ''))}" for c in criteria])
    evidence_text = "\n".join([f"- {e.get('text', '')[:500]}..." for e in evidence[:10]]) # Simple slice for now
    
    llm = get_llm()
    prompt = (
        "You are a Procurement Audit Specialist. "
        "Evaluate the following vendor evidence against the mandatory tender criteria. "
        f"\n\nTender Criteria:\n{criteria_text}"
        f"\n\nVendor Evidence Context:\n{evidence_text}"
    )
    
    try:
        extracted = await llm.generate_json(
            system="Evaluate compliance and provide a structured verdict. Return ONLY JSON.",
            user=prompt,
            schema_hint=RULE_ENGINE_SCHEMA_HINT
        )
        result = extracted if isinstance(extracted, dict) else {"overall_verdict": "needs_review", "score": 0.0, "confidence": 0.0, "criteria_breakdown": []}
    except Exception as e:
        result = {"overall_verdict": "needs_review", "error": str(e), "score": 0.0, "confidence": 0.0, "criteria_breakdown": []}

    if job_id:
        await stage_update(job_id=job_id, stage_name="Rule Engine Validation", stage_status="completed")
        
    return {"result": result}
