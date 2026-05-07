from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditEvent


async def audit_log(
    session: AsyncSession,
    *,
    entity_type: str,
    entity_id: str,
    event_type: str,
    message: str | None = None,
    payload: dict | None = None,
    actor: str | None = None,
) -> None:
    session.add(
        AuditEvent(
            entity_type=entity_type,
            entity_id=entity_id,
            event_type=event_type,
            message=message,
            payload=payload,
            actor=actor,
        )
    )
    await session.commit()
