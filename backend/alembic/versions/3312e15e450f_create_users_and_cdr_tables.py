"""create users and cdr tables

Revision ID: 3312e15e450f
Revises:
Create Date: 2026-03-21 13:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3312e15e450f"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cdr",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("caller_number", sa.String(length=20), nullable=False),
        sa.Column("receiver_number", sa.String(length=20), nullable=False),
        sa.Column("call_type", sa.Enum("incoming", "outgoing", name="call_type"), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("duration >= 0", name="ck_cdr_duration_non_negative"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_cdr_call_type"), "cdr", ["call_type"], unique=False)
    op.create_index(op.f("ix_cdr_caller_number"), "cdr", ["caller_number"], unique=False)
    op.create_index(op.f("ix_cdr_city"), "cdr", ["city"], unique=False)
    op.create_index(op.f("ix_cdr_receiver_number"), "cdr", ["receiver_number"], unique=False)
    op.create_index(op.f("ix_cdr_timestamp"), "cdr", ["timestamp"], unique=False)
    op.create_index("ix_cdr_timestamp_city", "cdr", ["timestamp", "city"], unique=False)

    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.Enum("admin", "analyst", name="user_role"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

    op.drop_index("ix_cdr_timestamp_city", table_name="cdr")
    op.drop_index(op.f("ix_cdr_timestamp"), table_name="cdr")
    op.drop_index(op.f("ix_cdr_receiver_number"), table_name="cdr")
    op.drop_index(op.f("ix_cdr_city"), table_name="cdr")
    op.drop_index(op.f("ix_cdr_caller_number"), table_name="cdr")
    op.drop_index(op.f("ix_cdr_call_type"), table_name="cdr")
    op.drop_table("cdr")
