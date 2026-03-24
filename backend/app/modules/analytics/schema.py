from pydantic import BaseModel

from app.modules.cdr.model import CallType


class CallTypeCount(BaseModel):
    call_type: CallType
    count: int


class TopCaller(BaseModel):
    caller_number: str
    total_calls: int
    total_duration: int


class AnalyticsSummaryResponse(BaseModel):
    total_calls: int
    total_duration: int
    call_type_distribution: list[CallTypeCount]
    top_callers: list[TopCaller]
