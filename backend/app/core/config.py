from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://euroaibench:EuroAI2026!@db:5432/euroaibench"
    SECRET_KEY: str = "change-me"
    ENVIRONMENT: str = "production"
    OLLAMA_HOST: str = "http://192.168.1.164:11434"
    OLLAMA_MODEL: str = "mistral"
    CORS_ORIGINS: str = "http://localhost:3200"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(',')]

    class Config:
        env_file = ".env"

settings = Settings()
