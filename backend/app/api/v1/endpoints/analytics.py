from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.modules.analytics.schema import AnalyticsSummaryResponse
from app.modules.analytics.service import get_analytics_summary
from app.modules.auth.model import User, UserRole
from app.modules.cdr.model import CallType
from app.utils.responses import SuccessResponse, success_response

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=SuccessResponse[AnalyticsSummaryResponse])
def analytics_summary(
    start_date: datetime | None = Query(default=None),
    end_date: datetime | None = Query(default=None),
    caller: str | None = Query(default=None, min_length=1, max_length=20),
    receiver: str | None = Query(default=None, min_length=1, max_length=20),
    city: str | None = Query(default=None, min_length=1, max_length=120),
    location: str | None = Query(default=None, min_length=1, max_length=255),
    call_type: CallType | None = Query(default=None),
    top_n: int = Query(default=5, ge=1, le=20),
    _: User = Depends(require_roles(UserRole.admin, UserRole.analyst)),
    db: Session = Depends(get_db),
) -> dict:
    summary = get_analytics_summary(
        db=db,
        start_date=start_date,
        end_date=end_date,
        caller=caller,
        receiver=receiver,
        city=city,
        location=location,
        call_type=call_type,
        top_n=top_n,
    )
    return success_response(summary, message="Analytics summary fetched successfully")
