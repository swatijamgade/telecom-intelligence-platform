from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.middleware.request_id import RequestIDMiddleware
from app.utils.responses import SuccessResponse, success_response


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.app_env)
    allowed_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]

    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        debug=settings.app_debug,
        default_response_class=ORJSONResponse,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestIDMiddleware)

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/", tags=["health"], response_model=SuccessResponse[dict[str, str]])
    async def root() -> dict:
        return success_response(
            {"message": "Telecom Intelligence Platform API", "status": "ok"},
            message="Service healthy",
        )

    @app.get("/health", tags=["health"], response_model=SuccessResponse[dict[str, str]])
    async def health() -> dict:
        return success_response(
            {"status": "ok", "environment": settings.app_env},
            message="Health check successful",
        )

    return app


app = create_app()
