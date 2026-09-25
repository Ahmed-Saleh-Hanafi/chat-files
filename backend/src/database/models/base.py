"""
Base model for all models
"""
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime
from sqlalchemy import DateTime, func

class BaseModel(DeclarativeBase):
    
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now(),
        nullable=False
    )