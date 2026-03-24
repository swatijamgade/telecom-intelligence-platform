import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import CheckConstraint, DateTime, Enum, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class CallType(str, enum.Enum):
    incoming = "incoming"
    outgoing = "outgoing"


class CDR(Base):
    __tablename__ = "cdr"
    __table_args__ = (
        CheckConstraint("duration >= 0", name="ck_cdr_duration_non_negative"),
        Index("ix_cdr_timestamp_city", "timestamp", "city"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    caller_number: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    receiver_number: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    call_type: Mapped[CallType] = mapped_column(
        Enum(CallType, name="call_type"),
        nullable=False,
        index=True,
    )
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    city: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
