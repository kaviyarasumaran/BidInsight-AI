from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "BidInsight API"
    env: str = "dev"
    log_level: str = "info"
    api_prefix: str = "/api"

    postgres_dsn: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/bidinsight"
    postgres_required: bool = False
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "bidinsight"
    redis_dsn: str = "redis://localhost:6379/0"
    queue_backend: str = "local"  # local | arq
    redis_required: bool = False

    storage_backend: str = "local"
    local_storage_path: str = "./storage"

    llm_provider: str = "ollama"  # ollama | (future providers)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1"
    lmstudio_base_url: str = "http://127.0.0.1:1234"
    lmstudio_model: str = "local-model"

    cors_allow_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    cors_allow_credentials: bool = True
    cors_allow_methods: str = "*"
    cors_allow_headers: str = "*"

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[1] / ".env"),
        env_prefix="",
        extra="ignore",
    )


settings = Settings()
