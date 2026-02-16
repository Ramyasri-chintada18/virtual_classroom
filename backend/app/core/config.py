from typing import List, Literal, Union
from pydantic import AnyHttpUrl, EmailStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Base
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Virtual Classroom Production API"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    
    # Security
    SECRET_KEY: str = "changethis_to_a_secure_random_string_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database (Postgres)
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "ramyasri131518password"
    POSTGRES_DB: str = "classroom_db"
    POSTGRES_PORT: int = 5432
    # Database
    DATABASE_URL: str = "mongodb://localhost:27017/classroom_db"

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_connection(cls, v: str | None, info) -> str:
        if isinstance(v, str) and (v.startswith("mongodb://") or v.startswith("mongodb+srv://")):
            return v
        return "mongodb://localhost:27017/classroom_db"

    # Redis (Caching & WebSockets)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str | None = None

    @field_validator("REDIS_URL", mode="before")
    def assemble_redis_url(cls, v: str | None, info) -> str:
        if isinstance(v, str):
            return v
        return f"redis://{info.data.get('REDIS_HOST')}:{info.data.get('REDIS_PORT')}/0"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(
        case_sensitive=True, 
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
