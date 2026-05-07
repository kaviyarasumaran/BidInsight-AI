from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class VendorSubmission(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "vendor_submissions"

    vendor_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    tender_id: Mapped[UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True, index=True)

    upload_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    processing_job_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    notes: Mapped[str | None] = mapped_column(Text(), nullable=True)
