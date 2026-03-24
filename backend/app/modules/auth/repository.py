from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.auth.model import User


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_id(db: Session, user_id) -> User | None:
    return db.scalar(select(User).where(User.id == user_id))


def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_users(db: Session) -> list[User]:
    return list(db.scalars(select(User).order_by(User.created_at.desc())))


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
