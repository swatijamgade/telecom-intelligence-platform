"""
Import model modules for SQLAlchemy metadata and Alembic autogeneration.

This module must be imported before reading Base.metadata.
"""

from app.modules.auth.model import User, UserRole  # noqa: F401
from app.modules.cdr.model import CDR, CallType  # noqa: F401
