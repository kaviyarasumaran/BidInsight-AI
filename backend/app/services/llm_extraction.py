from __future__ import annotations

import uuid


async def extract_criteria(*, combined_text: str) -> list[dict]:
    # Placeholder: call an LLM to extract structured criteria.
    if not combined_text.strip():
        return []
    return [
        {
            "criterion_id": f"crit_{uuid.uuid4().hex[:8]}",
            "text": "Placeholder extracted criterion (replace with LLM output).",
            "category": "general",
            "mandatory": True,
            "confidence": 0.5,
            "source": {"type": "text", "offset": 0},
        }
    ]
