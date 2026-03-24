import uuid

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_roles
from app.core.config import get_settings
from app.db.session import get_db
from app.modules.auth.model import User, UserRole
from app.modules.auth.schema import AdminUserCreate, AuthResponse, LoginRequest, UserCreate, UserPublic
from app.modules.auth.service import create_user_by_admin, list_users_public, login_user, remove_user_by_admin, signup_user
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


@router.get("/users", response_model=SuccessResponse[list[UserPublic]])
def users(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> dict:
    records = list_users_public(db)
    return success_response(records, message="Users fetched successfully")


@router.post("/users", response_model=SuccessResponse[UserPublic], status_code=201)
def create_user(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(UserRole.admin)),
) -> dict:
    created = create_user_by_admin(db, payload)
    return success_response(created, message="User created successfully")


@router.delete("/users/{user_id}", response_model=SuccessResponse[dict[str, str]])
def remove_user(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
) -> dict:
    result = remove_user_by_admin(db, user_id, current_user.id)
    return success_response(result, message="User removed successfully")
