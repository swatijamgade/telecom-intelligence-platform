from fastapi import APIRouter

from app.api.v1.endpoints.analytics import router as analytics_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.cdr import router as cdr_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(cdr_router)
api_router.include_router(analytics_router)
