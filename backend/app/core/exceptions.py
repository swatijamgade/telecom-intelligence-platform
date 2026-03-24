from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.utils.responses import error_response


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        details = [
            {
                "field": ".".join(str(v) for v in error["loc"]),
                "message": error["msg"],
                "code": error["type"],
            }
            for error in exc.errors()
        ]
        payload = error_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message="Validation error",
            code="validation_error",
            details=details,
        )
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=payload)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        details: Any = None
        code = "http_error"

        if isinstance(exc.detail, dict):
            message = exc.detail.get("message", "Request failed")
            code = exc.detail.get("code", "http_error")
            details = exc.detail.get("details", exc.detail)
        else:
            message = str(exc.detail)
            details = {"raw": exc.detail}

        payload = error_response(
            status_code=exc.status_code,
            message=message,
            code=code,
            details=details,
        )
        return JSONResponse(status_code=exc.status_code, content=payload, headers=exc.headers)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_: Request, __: Exception) -> JSONResponse:
        payload = error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
            code="internal_error",
            details={"reason": "An unexpected error occurred"},
        )
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=payload)
