from __future__ import annotations
from fastapi import APIRouter, HTTPException
from app.db.mongo import get_mongo_db
from datetime import datetime
from uuid import uuid4

router = APIRouter()

@router.get("")
async def get_recent_chats():
    db = get_mongo_db()
    cursor = db.chat_sessions.find().sort("updated_at", -1).limit(20)
    chats = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        chats.append(doc)
    return chats

@router.post("")
async def create_or_update_chat(payload: dict):
    db = get_mongo_db()
    tender_id = payload.get("tender_id")
    if not tender_id:
        raise HTTPException(status_code=400, detail="tender_id required")
    
    chat_id = payload.get("chat_id") or str(uuid4())
    
    chat_doc = {
        "chat_id": chat_id,
        "tender_id": tender_id,
        "job_id": payload.get("job_id"),
        "text": payload.get("text", "New Session"),
        "messages": payload.get("messages", []),
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }
    
    await db.chat_sessions.replace_one({"chat_id": chat_id}, chat_doc, upsert=True)
    return {"chat_id": chat_id}

@router.get("/{chat_id}")
async def get_chat_session(chat_id: str):
    db = get_mongo_db()
    doc = await db.chat_sessions.find_one({"chat_id": chat_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Chat not found")
    doc.pop("_id", None)
    return doc
