from __future__ import annotations
from app.nodes.job_node import job_update, stage_update
from app.core.llm.factory import get_llm

async def explainability_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="Explainability Engine", stage_status="processing")
        await job_update(job_id=job_id, progress=85, current_step="Explainability: generating narrative justifications")

    result = state.get("result") or {}
    verdict = result.get("overall_verdict", "Needs Manual Review")
    breakdown = result.get("criteria_breakdown", [])
    
    # Format breakdown for LLM
    breakdown_text = "\n".join([f"- {b.get('criterion_id')}: {b.get('status')} - {b.get('reason')}" for b in breakdown])
    
    llm = get_llm()
    prompt = (
        "You are a Senior Procurement Officer. "
        "Based on the following compliance breakdown, generate a professional, narrative 'Final Procurement Recommendation' summary. "
        "Explain the key reasons for the final verdict and highlight any specific risks or mandatory compliance successes."
        f"\n\nFinal Verdict: {verdict}"
        f"\n\nCompliance Breakdown:\n{breakdown_text}"
    )
    
    try:
        explanation = await llm.generate_text(
            system="Generate a professional procurement summary narrative. Be concise, objective, and authoritative.",
            user=prompt
        )
    except Exception as e:
        explanation = f"Automated explanation generation failed: {str(e)}. Please refer to the criteria-level breakdown."

    # Enrich the result with the narrative
    result["final_narrative_summary"] = explanation
    
    if job_id:
        await stage_update(job_id=job_id, stage_name="Explainability Engine", stage_status="completed")
        
    return {"result": result}
