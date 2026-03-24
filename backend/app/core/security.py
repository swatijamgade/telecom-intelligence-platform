from datetime import UTC, datetime, timedelta
import re

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings

ALGORITHM = "HS256"
_DURATION_PATTERN = re.compile(r"^(?P<value>\d+)(?P<unit>[smhd])$")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def parse_expiry(value: str) -> timedelta:
    match = _DURATION_PATTERN.match(value.strip().lower())
    if not match:
        raise ValueError("JWT_EXPIRES_IN must be like 15m, 12h, or 7d")

    amount = int(match.group("value"))
    unit = match.group("unit")

    if unit == "s":
        return timedelta(seconds=amount)
    if unit == "m":
        return timedelta(minutes=amount)
    if unit == "h":
        return timedelta(hours=amount)
    return timedelta(days=amount)


def create_access_token(subject: str, role: str) -> tuple[str, int]:
    settings = get_settings()
    expires_delta = parse_expiry(settings.jwt_expires_in)
    expire_at = datetime.now(UTC) + expires_delta

    payload = {
        "sub": subject,
        "role": role,
        "exp": expire_at,
    }

    token = jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)
    return token, int(expires_delta.total_seconds())


def decode_access_token(token: str) -> dict:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
