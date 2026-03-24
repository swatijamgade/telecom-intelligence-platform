from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.model import User, UserRole
from app.modules.auth.repository import create_user, delete_user, get_user_by_email, get_user_by_id, list_users
from app.modules.auth.schema import AdminUserCreate, AuthResponse, LoginRequest, TokenResponse, UserCreate, UserPublic


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


def list_users_public(db: Session) -> list[UserPublic]:
    users = list_users(db)
    return [UserPublic.model_validate(user) for user in users]


def create_user_by_admin(db: Session, payload: AdminUserCreate) -> UserPublic:
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

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    created = create_user(db, user)
    return UserPublic.model_validate(created)


def remove_user_by_admin(db: Session, target_user_id, current_user_id) -> dict[str, str]:
    target_user = get_user_by_id(db, target_user_id)
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "field": "user_id",
                "message": "User not found",
                "code": "user_not_found",
            },
        )

    if str(target_user.id) == str(current_user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "field": "user_id",
                "message": "You cannot remove your own account",
                "code": "self_delete_forbidden",
            },
        )

    delete_user(db, target_user)
    return {"status": "deleted", "user_id": str(target_user_id)}
