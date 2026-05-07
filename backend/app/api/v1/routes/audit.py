from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_session
from app.models.audit import AuditEvent

router = APIRouter()


@router.get("/{entity_type}/{entity_id}")
async def get_audit(entity_type: str, entity_id: str, session: AsyncSession = Depends(get_session)):
    stmt = (
        select(AuditEvent)
        .where(AuditEvent.entity_type == entity_type)
        .where(AuditEvent.entity_id == entity_id)
        .order_by(AuditEvent.created_at.asc())
    )
    events = (await session.execute(stmt)).scalars().all()
    return {
        "entity_type": entity_type,
        "entity_id": entity_id,
        "timeline": [
            {
                "event_id": str(e.id),
                "ts": e.created_at.isoformat(),
                "event_type": e.event_type,
                "message": e.message,
                "payload": e.payload,
                "actor": e.actor,
            }
            for e in events
        ],
    }
