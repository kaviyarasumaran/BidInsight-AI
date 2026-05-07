from __future__ import annotations

from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ManualReviewCase(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "manual_review_cases"

    tender_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    vendor_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    priority: Mapped[int] = mapped_column(default=3, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="open", nullable=False, index=True)

    summary: Mapped[str] = mapped_column(String(500), nullable=False)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    officer_note: Mapped[str | None] = mapped_column(Text(), nullable=True)
