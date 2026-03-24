import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.modules.cdr.model import CallType


class CDRPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    caller_number: str
    receiver_number: str
    call_type: CallType
    duration: int
    timestamp: datetime
    city: str
    location: str | None
    created_at: datetime


class CDRListResponse(BaseModel):
    items: list[CDRPublic]
    page: int
    page_size: int
    total: int
    total_pages: int
