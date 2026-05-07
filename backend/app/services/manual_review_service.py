from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import SessionLocal
from app.models.manual_review import ManualReviewCase


def needs_manual_review(*, confidence: float) -> bool:
    return confidence < 0.7


async def create_manual_review_case(
    *,
    tender_id: str,
    vendor_id: str | None,
    summary: str,
    details: dict | None = None,
    priority: int = 3,
) -> str:
    async with SessionLocal() as session:  # type: AsyncSession
        case = ManualReviewCase(
            tender_id=tender_id,
            vendor_id=vendor_id,
            summary=summary,
            details=details,
            priority=priority,
            status="open",
        )
        session.add(case)
        await session.commit()
        await session.refresh(case)
        return str(case.id)
