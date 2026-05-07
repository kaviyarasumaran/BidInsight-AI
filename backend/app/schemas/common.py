from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class APIModel(BaseModel):
    model_config = {"from_attributes": True}


class IdResponse(APIModel):
    id: UUID


class JobRef(APIModel):
    processing_job_id: str
