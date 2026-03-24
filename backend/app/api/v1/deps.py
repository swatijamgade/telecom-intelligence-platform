import uuid
from collections.abc import Callable

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.modules.auth.model import User, UserRole
from app.modules.auth.repository import get_user_by_id


def _extract_access_token(request: Request) -> str | None:
    auth_header = request.headers.get("authorization")
    if auth_header:
        scheme, _, token = auth_header.partition(" ")
        if scheme.lower() == "bearer" and token.strip():
            return token.strip()

    cookie_token = request.cookies.get(get_settings().auth_cookie_name)
    if cookie_token:
        return cookie_token

    return None


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={
            "field": None,
            "message": "Could not validate credentials",
            "code": "invalid_credentials",
        },
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = _extract_access_token(request)
    if token is None:
        raise credentials_error

    try:
        payload = decode_access_token(token)
    except ValueError as exc:
        raise credentials_error from exc

    user_id = payload.get("sub")
    if not user_id:
        raise credentials_error

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError as exc:
        raise credentials_error from exc

    user = get_user_by_id(db, user_uuid)
    if user is None:
        raise credentials_error

    return user


def require_roles(*allowed_roles: UserRole) -> Callable:
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "field": None,
                    "message": "You do not have permission to access this resource",
                    "code": "insufficient_permissions",
                },
            )
        return current_user

    return role_checker
