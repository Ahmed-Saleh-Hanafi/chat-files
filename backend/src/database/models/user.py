from .base import BaseModel
from datetime import datetime
from sqlalchemy import Boolean, DateTime, String, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

class UserModel(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False
    )

    user_name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now(),
        nullable=False
    )

    chat_connect: Mapped[int] = mapped_column(
        Integer,
        default=1000,
        nullable=False
    )