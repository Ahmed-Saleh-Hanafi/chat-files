from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from .engine import engine


Session = AsyncSession

SessionMaker = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)