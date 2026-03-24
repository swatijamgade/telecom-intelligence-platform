from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = Field(default="Success")
    data: T


class ErrorDetail(BaseModel):
    code: str = Field(default="http_error")
    message: str = Field(default="Request failed")
    status: int = Field(default=400, ge=100, le=599)
    details: Any = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail


def success_response(
    data: Any,
    *,
    message: str = "Success",
) -> dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def error_response(status_code: int, message: str, code: str, details: Any = None) -> dict[str, Any]:
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "status": status_code,
            "details": details,
        },
    }
