from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.llm.factory import get_llm
from app.db.mongo import get_mongo_db
from app.services.job_service import get_job_status
from app.services.preview_service import get_live_preview

router = APIRouter()


@router.get("/context/{job_id}")
async def agent_context(job_id: str):
    status = await get_job_status(job_id)
    if not status:
        raise HTTPException(status_code=404, detail="job not found")
    preview = await get_live_preview(job_id=job_id)

    mongo = get_mongo_db()
    tender_id_raw = status.get("tender_id")
    tender_id = str(tender_id_raw) if tender_id_raw else None
    vendor_id = status.get("vendor_id") or None
    evaluation_id = status.get("evaluation_id") or None

    tender_criteria = None
    if tender_id:
        tender_criteria = await mongo.tender_criteria.find_one({"tender_id": tender_id}) or None
        if tender_criteria:
            tender_criteria.pop("_id", None)

    tender_context = None
    if tender_id:
        tender_context = await mongo.tender_context.find_one({"tender_id": tender_id}) or None
        if tender_context:
            tender_context.pop("_id", None)

    vendor_evidence = None
    if vendor_id:
        vendor_evidence = await mongo.vendor_evidence.find_one({"vendor_id": vendor_id, "tender_id": tender_id}) or None
        if vendor_evidence:
            vendor_evidence.pop("_id", None)

    evaluation_results = None
    if evaluation_id:
        evaluation_results = await mongo.evaluation_results.find_one({"evaluation_id": evaluation_id}) or None
        if evaluation_results:
            evaluation_results.pop("_id", None)

    return {
        "job_id": job_id,
        "status": status,
        "preview": preview,
        "tender_criteria": tender_criteria,
        "tender_context": tender_context,
        "vendor_evidence": vendor_evidence,
        "evaluation_results": evaluation_results,
    }


from app.services.active_tender_context_service import ActiveTenderContextService

@router.post("/chat")
async def agent_chat(payload: dict):
    job_id = payload.get("job_id")
    message = payload.get("message")
    if not job_id or not message:
        raise HTTPException(status_code=400, detail="job_id and message are required")
    
    status = await get_job_status(job_id)
    if not status:
         raise HTTPException(status_code=404, detail="Session not found")
         
    tender_id = status.get("tender_id")
    if not tender_id:
        return {"answer": "No active tender context found for this session. Please upload a tender document first."}

    t_id = str(tender_id)
    
    # 1. HARD CONTEXT LOCK: Fetch structured context first (Primary Source)
    active_ctx = await ActiveTenderContextService.get_active_context(t_id)
    
    # 2. SCOPED RETRIEVAL: Fetch chunks only if strictly required, always scoped to t_id
    kb_snippets = await ActiveTenderContextService.get_scoped_chunks(t_id, message)
    
    # 3. EVALUATION DATA
    evaluation_results = None
    evaluation_id = status.get("evaluation_id")
    if evaluation_id:
        mongo = get_mongo_db()
        evaluation_results = await mongo.evaluation_results.find_one({"evaluation_id": evaluation_id})

    # Strict Safety Check: If NO context found for this tender_id, stop and report
    if not active_ctx and not kb_snippets:
        return {"answer": "Not found in current tender document. (Hard Lock Active)"}

    llm = get_llm()
    # Build the restricted context for the LLM
    compact = {
        "active_tender_id": t_id,
        "structured_context": {
            "tender_summary": (active_ctx or {}).get("project_summary"),
            "scope_of_work": (active_ctx or {}).get("scope_of_work"),
            "department": (active_ctx or {}).get("department"),
            "key_clauses": (active_ctx or {}).get("clauses"),
            "eligibility_criteria": (active_ctx or {}).get("criteria", [])[:10],
        },
        "knowledge_base_snippets": kb_snippets,
        "bidder_evaluation": evaluation_results,
    }
    
    system_prompt = (
        "You are BidInsight AI, a Tender Intelligence Copilot. "
        f"CRITICAL: You are LOCKED to Tender ID: {t_id}. "
        "You must follow this RETRIEVAL PRIORITY:\n"
        "1. Use 'structured_context' (Summary, Scope, Department) as the absolute truth.\n"
        "2. Use 'knowledge_base_snippets' only if the answer is not in structured context.\n"
        "3. Use 'bidder_evaluation' for questions about compliance or evidence.\n\n"
        "RULES:\n"
        "- If the user asks about 'Scope of Work', ONLY use the 'scope_of_work' field from 'structured_context'.\n"
        "- If the answer is not present in the provided fields, say: 'Not found in current tender document.'\n"
        "- NEVER mention CRM systems, IT Infrastructure, or other unrelated projects. If you find them in your internal memory, ignore them.\n"
        "- Your response must be 100% verified by the context provided below."
    )
    
    answer = await llm.generate_json(
        system=system_prompt,
        user=f"Context for Active Tender ({t_id}):\n{compact}\n\nUser Question: {message}\n\nReturn JSON: {{\"answer\":\"...\"}}",
        schema_hint='{"answer":"string"}',
    )
    
    if isinstance(answer, dict) and "answer" in answer:
        return answer
    return {"answer": str(answer)}
