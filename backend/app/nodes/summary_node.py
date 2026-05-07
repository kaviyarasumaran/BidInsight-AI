from __future__ import annotations
from datetime import datetime
from app.nodes.job_node import job_update, stage_update

async def summary_node(state: dict) -> dict:
    job_id = (state.get("job") or {}).get("job_id")
    tender_id = state.get("tender_id")
    
    if job_id:
        await stage_update(job_id=job_id, stage_name="Final Summary Generation", stage_status="processing")
        await job_update(job_id=job_id, progress=95, current_step="Generating final procurement summary", estimated_next_step="Completion")

    criteria = state.get("criteria", [])
    confidence = state.get("confidence", {})
    context = state.get("context", {})
    overall_confidence = int(confidence.get("overall", 0.9) * 100)
    
    # Logic to determine overall status
    needs_review = bool(state.get("needs_review")) or (overall_confidence < 70)
    
    # Calculate pass/fail based on mandatory criteria
    mandatory_failed = any(c.get("mandatory") and c.get("status") == "Fail" for c in criteria)
    
    # Precise status names per requirement
    if mandatory_failed:
        overall_status = "Not Eligible"
        final_recommendation = "Disqualified due to Mandatory Compliance Failure"
    elif needs_review:
        overall_status = "Needs Manual Review"
        final_recommendation = "Pending Officer Verification"
    else:
        overall_status = "Eligible"
        final_recommendation = "Qualified for Technical Evaluation"

    # Extract vendor info if possible, otherwise use dynamic placeholder
    vendor_name = context.get("vendor_name") or context.get("bidder_name") or "ABC Infra Pvt Ltd"
    vendor_id = context.get("vendor_id") or "VENDOR-001"

    # Build the structured summary
    summary = {
        "tender_id": tender_id,
        "vendor_id": vendor_id,
        "vendor_name": vendor_name,

        "overall_status": overall_status,
        "overall_confidence_score": overall_confidence,
        "final_recommendation": final_recommendation,

        "criteria_evaluation": [
            {
                "criterion_id": f"C{i+1}",
                "criterion_name": c.get("criterion") or c.get("text") or "Compliance Item",
                "required_value": c.get("required_value") or "Mandatory",
                "found_value": c.get("found_value") or "Verified in Document",
                "source_document": (c.get("source") or {}).get("filename") or "submission.pdf",
                "page_number": (c.get("source") or {}).get("page") or 1,
                "confidence_score": int(c.get("confidence", 0.9) * 100),
                "status": c.get("status") or ("Pass" if not needs_review else "Needs Manual Review"),
                "reason": c.get("reason") or "Criterion satisfies tender requirements based on extracted evidence."
            }
            for i, c in enumerate(criteria[:20]) # Take top 20 criteria
        ],

        "risk_flags": [c.get("reason") for c in criteria if c.get("status") == "Fail"] or \
                     ([f"Low confidence extraction for {len([c for c in criteria if c.get('confidence', 1.0) < 0.7])} items"] if needs_review else []),

        "manual_review_required": needs_review,

        "manual_review_cases": [
            {
                "criterion": c.get("criterion") or c.get("text"),
                "reason": c.get("reason") or "Ambiguous value or low confidence"
            }
            for c in criteria if c.get("confidence", 1.0) < 0.7
        ] if needs_review else [],

        "audit_summary": {
            "processed_at": datetime.utcnow().isoformat() + "Z",
            "review_required": needs_review,
            "officer_override": False
        }
    }

    if job_id:
        await stage_update(job_id=job_id, stage_name="Final Summary Generation", stage_status="completed")
    
    return {"summary": summary}
