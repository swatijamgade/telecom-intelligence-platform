import math
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.cdr.model import CallType
from app.modules.cdr.repository import build_cdr_filters, count_cdr, list_cdr_records
from app.modules.cdr.schema import CDRListResponse, CDRPublic


def get_cdr_list(
    db: Session,
    page: int,
    page_size: int,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    caller: str | None = None,
    receiver: str | None = None,
    city: str | None = None,
    location: str | None = None,
    call_type: CallType | None = None,
) -> CDRListResponse:
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "field": "end_date",
                "message": "end_date must be greater than or equal to start_date",
                "code": "invalid_date_range",
            },
        )

    conditions = build_cdr_filters(
        start_date=start_date,
        end_date=end_date,
        caller=caller,
        receiver=receiver,
        city=city,
        location=location,
        call_type=call_type,
    )

    total = count_cdr(db, conditions)
    offset = (page - 1) * page_size
    records = list_cdr_records(db, conditions, offset, page_size)
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return CDRListResponse(
        items=[CDRPublic.model_validate(record) for record in records],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )
