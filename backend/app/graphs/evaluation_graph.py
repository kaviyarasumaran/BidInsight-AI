from __future__ import annotations

from langgraph.graph import END, StateGraph

from app.nodes.rule_engine_node import rule_engine_node
from app.nodes.explainability_node import explainability_node
from app.nodes.types import EvaluationState


async def matching_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    if job_id:
        await stage_update(job_id=job_id, stage_name="Evidence Matching", stage_status="processing")
        await job_update(job_id=job_id, progress=25, current_step="Matching criteria to evidence")
    
    # In a full RAG system, this would do vector search. 
    # For now, we pass the data through to the rule engine.
    if job_id:
        await stage_update(job_id=job_id, stage_name="Evidence Matching", stage_status="completed")
    return {}


async def audit_node(state: dict) -> dict:
    return {}


def build_evaluation_graph():
    g = StateGraph(EvaluationState)
    g.add_node("matching", matching_node)
    g.add_node("rules", rule_engine_node)
    g.add_node("explainability", explainability_node)
    g.add_node("audit", audit_node)

    g.set_entry_point("matching")
    g.add_edge("matching", "rules")
    g.add_edge("rules", "explainability")
    g.add_edge("explainability", "audit")
    g.add_edge("audit", END)
    return g.compile()
