from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Vendor(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "vendors"

    vendor_name: Mapped[str] = mapped_column(String(300), nullable=False)
    gst_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    contact_info: Mapped[str | None] = mapped_column(Text(), nullable=True)
