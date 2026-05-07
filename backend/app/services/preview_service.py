from __future__ import annotations

from app.db.mongo import get_mongo_db
from app.services.websocket_service import hub


async def upsert_live_preview(*, job_id: str, payload: dict) -> None:
    db = get_mongo_db()
    await db.job_live_preview.replace_one({"job_id": job_id}, {"job_id": job_id, **payload}, upsert=True)
    await hub.broadcast(job_id, {"type": "preview", "job_id": job_id, **payload})


async def get_live_preview(*, job_id: str) -> dict:
    db = get_mongo_db()
    doc = await db.job_live_preview.find_one({"job_id": job_id}) or {}
    doc.pop("_id", None)
    return doc
