from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.modules.auth.model import User
from app.modules.auth.schema import AuthResponse, LoginRequest, UserCreate, UserPublic
from app.modules.auth.service import login_user, signup_user
from app.utils.responses import SuccessResponse, success_response

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=SuccessResponse[AuthResponse], status_code=201)
def signup(payload: UserCreate, response: Response, db: Session = Depends(get_db)) -> dict:
    auth_response = signup_user(db, payload)
    settings = get_settings()
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=auth_response.token.access_token,
        max_age=auth_response.token.expires_in_seconds,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        path="/",
    )
    return success_response(auth_response, message="Signup successful")


@router.post("/login", response_model=SuccessResponse[AuthResponse])
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> dict:
    auth_response = login_user(db, payload)
    settings = get_settings()
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=auth_response.token.access_token,
        max_age=auth_response.token.expires_in_seconds,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        path="/",
    )
    return success_response(auth_response, message="Login successful")


@router.get("/me", response_model=SuccessResponse[UserPublic])
def me(current_user: User = Depends(get_current_user)) -> dict:
    profile = UserPublic.model_validate(current_user)
    return success_response(profile, message="Profile fetched successfully")


@router.post("/logout", response_model=SuccessResponse[dict[str, str]])
def logout(response: Response) -> dict:
    settings = get_settings()
    response.set_cookie(
        key=settings.auth_cookie_name,
        value="",
        max_age=0,
        expires=0,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        path="/",
    )
    return success_response({"status": "logged_out"}, message="Logout successful")
