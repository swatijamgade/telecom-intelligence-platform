from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.v1.deps import require_roles
from app.db.session import get_db
from app.modules.auth.model import User, UserRole
from app.modules.cdr.model import CallType
from app.modules.cdr.schema import CDRListResponse
from app.modules.cdr.service import get_cdr_list
from app.utils.responses import SuccessResponse, success_response

router = APIRouter(prefix="/cdr", tags=["cdr"])


@router.get("/", response_model=SuccessResponse[CDRListResponse])
def list_cdr(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    start_date: datetime | None = Query(default=None),
    end_date: datetime | None = Query(default=None),
    caller: str | None = Query(default=None, min_length=1, max_length=20),
    receiver: str | None = Query(default=None, min_length=1, max_length=20),
    city: str | None = Query(default=None, min_length=1, max_length=120),
    location: str | None = Query(default=None, min_length=1, max_length=255),
    call_type: CallType | None = Query(default=None),
    _: User = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db),
) -> dict:
    cdr_list = get_cdr_list(
        db=db,
        page=page,
        page_size=page_size,
        start_date=start_date,
        end_date=end_date,
        caller=caller,
        receiver=receiver,
        city=city,
        location=location,
        call_type=call_type,
    )
    return success_response(cdr_list, message="CDR list fetched successfully")
