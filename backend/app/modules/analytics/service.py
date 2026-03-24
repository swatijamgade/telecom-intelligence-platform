from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.modules.analytics.schema import AnalyticsSummaryResponse, CallTypeCount, TopCaller
from app.modules.cdr.model import CDR, CallType
from app.modules.cdr.repository import build_cdr_filters


def get_analytics_summary(
    db: Session,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    caller: str | None = None,
    receiver: str | None = None,
    city: str | None = None,
    location: str | None = None,
    call_type: CallType | None = None,
    top_n: int = 5,
) -> AnalyticsSummaryResponse:
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

    summary_query = select(
        func.count(CDR.id).label("total_calls"),
        func.coalesce(func.sum(CDR.duration), 0).label("total_duration"),
    )
    distribution_query = select(CDR.call_type, func.count(CDR.id)).group_by(CDR.call_type)
    top_callers_query = (
        select(
            CDR.caller_number,
            func.count(CDR.id).label("total_calls"),
            func.coalesce(func.sum(CDR.duration), 0).label("total_duration"),
        )
        .group_by(CDR.caller_number)
        .order_by(desc("total_calls"), desc("total_duration"))
        .limit(top_n)
    )

    if conditions:
        summary_query = summary_query.where(*conditions)
        distribution_query = distribution_query.where(*conditions)
        top_callers_query = top_callers_query.where(*conditions)

    total_calls, total_duration = db.execute(summary_query).one()
    total_calls = total_calls or 0
    total_duration = total_duration or 0

    distribution_rows = db.execute(distribution_query).all()
    top_callers_rows = db.execute(top_callers_query).all()

    distribution_map = {ctype: count for ctype, count in distribution_rows}
    call_type_distribution = [
        CallTypeCount(call_type=CallType.incoming, count=distribution_map.get(CallType.incoming, 0)),
        CallTypeCount(call_type=CallType.outgoing, count=distribution_map.get(CallType.outgoing, 0)),
    ]

    top_callers = [
        TopCaller(
            caller_number=caller_number,
            total_calls=total_calls_count,
            total_duration=total_duration_count,
        )
        for caller_number, total_calls_count, total_duration_count in top_callers_rows
    ]

    return AnalyticsSummaryResponse(
        total_calls=total_calls,
        total_duration=total_duration,
        call_type_distribution=call_type_distribution,
        top_callers=top_callers,
    )
