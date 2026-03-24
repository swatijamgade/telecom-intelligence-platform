from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Telecom Intelligence Platform API", validation_alias="APP_NAME")
    app_env: str = Field(default="dev", validation_alias="APP_ENV")
    app_debug: bool = Field(default=True, validation_alias="APP_DEBUG")

    api_v1_prefix: str = Field(default="/api/v1", validation_alias="API_V1_PREFIX")
    host: str = Field(default="0.0.0.0", validation_alias="HOST")
    port: int = Field(default=5000, validation_alias="PORT")

    database_url: str = Field(
        default="postgresql+psycopg://telecom:telecom@localhost:5432/telecom_db",
        validation_alias="DATABASE_URL",
    )
    jwt_secret: str = Field(
        default="change_me_to_a_very_long_random_secret_key_12345",
        validation_alias="JWT_SECRET",
    )
    jwt_expires_in: str = Field(default="1d", validation_alias="JWT_EXPIRES_IN")
    auth_cookie_name: str = Field(default="telecom_access_token", validation_alias="AUTH_COOKIE_NAME")
    auth_cookie_secure: bool = Field(default=False, validation_alias="AUTH_COOKIE_SECURE")
    auth_cookie_samesite: str = Field(default="lax", validation_alias="AUTH_COOKIE_SAMESITE")
    cors_origins: str = Field(
        default="http://localhost:5173",
        validation_alias="CORS_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("cors_origins")
    @classmethod
    def normalize_cors_origins(cls, value: str) -> str:
        return ",".join(origin.strip() for origin in value.split(",") if origin.strip())

    @field_validator("jwt_secret")
    @classmethod
    def validate_jwt_secret(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError("JWT_SECRET must be at least 32 characters")
        return value

    @field_validator("auth_cookie_samesite")
    @classmethod
    def normalize_cookie_samesite(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in {"lax", "strict", "none"}:
            raise ValueError("AUTH_COOKIE_SAMESITE must be one of: lax, strict, none")
        return normalized


@lru_cache
def get_settings() -> Settings:
    return Settings()
