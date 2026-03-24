from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.cdr.model import CDR, CallType


def build_cdr_filters(
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    caller: str | None = None,
    receiver: str | None = None,
    city: str | None = None,
    location: str | None = None,
    call_type: CallType | None = None,
) -> list:
    conditions = []

    if start_date is not None:
        conditions.append(CDR.timestamp >= start_date)
    if end_date is not None:
        conditions.append(CDR.timestamp <= end_date)
    if caller:
        conditions.append(CDR.caller_number.ilike(f"%{caller.strip()}%"))
    if receiver:
        conditions.append(CDR.receiver_number.ilike(f"%{receiver.strip()}%"))
    if city:
        conditions.append(CDR.city.ilike(f"%{city.strip()}%"))
    if location:
        conditions.append(CDR.location.ilike(f"%{location.strip()}%"))
    if call_type is not None:
        conditions.append(CDR.call_type == call_type)

    return conditions


def count_cdr(db: Session, conditions: list) -> int:
    query = select(func.count(CDR.id))
    if conditions:
        query = query.where(*conditions)
    return db.scalar(query) or 0


def list_cdr_records(db: Session, conditions: list, offset: int, limit: int) -> list[CDR]:
    query = select(CDR)
    if conditions:
        query = query.where(*conditions)
    return db.scalars(query.order_by(CDR.timestamp.desc()).offset(offset).limit(limit)).all()
