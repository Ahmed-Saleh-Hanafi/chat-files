"""
Environment variables and application settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # app config
    APP_NAME: str
    APP_VERSION: str
    
    
    # database connection
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_NAME: str
    DATABASE_PORT: str 
    
    
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://"
            f"{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@localhost:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )
    
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

def get_settings() -> Settings:
    return Settings()
