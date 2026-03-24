import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.modules.auth.model import UserRole


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.analyst

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        name = value.strip()
        if len(name) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return name

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator("password")
    @classmethod
    def normalize_password(cls, value: str) -> str:
        return value.strip()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    role: UserRole
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in_seconds: int


class AuthResponse(BaseModel):
    user: UserPublic
    token: TokenResponse