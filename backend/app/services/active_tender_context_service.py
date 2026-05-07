from __future__ import annotations

from app.db.mongo import get_mongo_db

class ActiveTenderContextService:
    @staticmethod
    async def get_active_context(tender_id: str) -> dict | None:
        """
        Hard-locks the retrieval to a specific tender_id.
        No global fallback allowed.
        """
        if not tender_id:
            return None
            
        mongo = get_mongo_db()
        t_id = str(tender_id)
        
        # 1. Fetch structured context (The Primary Source of Truth)
        context_doc = await mongo.tender_context.find_one({"tender_id": t_id})
        criteria_doc = await mongo.tender_criteria.find_one({"tender_id": t_id})
        
        if not context_doc and not criteria_doc:
            return None
            
        return {
            "tender_id": t_id,
            "scope_of_work": (context_doc or {}).get("scope_of_work"),
            "department": (context_doc or {}).get("department"),
            "project_summary": (context_doc or {}).get("project_summary"),
            "clauses": {
                "financial": (context_doc or {}).get("financial_clauses", []),
                "technical": (context_doc or {}).get("technical_clauses", []),
                "compliance": (context_doc or {}).get("compliance_clauses", []),
            },
            "criteria": (criteria_doc or {}).get("criteria", [])
        }

    @staticmethod
    async def get_scoped_chunks(tender_id: str, query: str, limit: int = 5) -> list[str]:
        """
        Strictly scoped vector-like search within a single tender.
        """
        if not tender_id:
            return []
            
        mongo = get_mongo_db()
        t_id = str(tender_id)
        
        keywords = [w.lower() for w in query.split() if len(w) > 3]
        query_filter = {"tender_id": t_id}
        
        chunks = []
        if keywords:
            cursor = mongo.document_chunks.find({
                **query_filter,
                "content": {"$regex": "|".join(keywords), "$options": "i"}
            }).limit(limit)
            results = await cursor.to_list(length=limit)
            chunks = [r["content"] for r in results]
            
        if not chunks:
            cursor = mongo.document_chunks.find(query_filter).limit(3)
            results = await cursor.to_list(length=3)
            chunks = [r["content"] for r in results]
            
        return chunks
