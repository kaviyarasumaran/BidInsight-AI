from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.enums import TenderStatus


class Tender(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "tenders"

    tender_title: Mapped[str] = mapped_column(String(300), nullable=False)
    department: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text(), nullable=True)
    created_by: Mapped[str] = mapped_column(String(120), nullable=False)

    status: Mapped[str] = mapped_column(String(50), default=TenderStatus.draft.value, nullable=False)
    latest_job_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
