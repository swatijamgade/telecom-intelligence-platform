from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.model import User, UserRole
from app.modules.auth.repository import create_user, get_user_by_email
from app.modules.auth.schema import AuthResponse, LoginRequest, TokenResponse, UserCreate, UserPublic


def _build_auth_response(user: User) -> AuthResponse:
    access_token, expires_in_seconds = create_access_token(
        subject=str(user.id),
        role=user.role.value,
    )
    return AuthResponse(
        user=UserPublic.model_validate(user),
        token=TokenResponse(
            access_token=access_token,
            expires_in_seconds=expires_in_seconds,
        ),
    )


def signup_user(db: Session, payload: UserCreate) -> AuthResponse:
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "field": "email",
                "message": "Email already registered",
                "code": "duplicate_email",
            },
        )

    if payload.role == UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "field": "role",
                "message": "Public signup cannot create admin users",
                "code": "admin_signup_forbidden",
            },
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    created = create_user(db, user)
    return _build_auth_response(created)


def login_user(db: Session, payload: LoginRequest) -> AuthResponse:
    user = get_user_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "field": None,
                "message": "Invalid email or password",
                "code": "invalid_credentials",
            },
        )
    return _build_auth_response(user)
