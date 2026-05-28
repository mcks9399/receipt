from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./receipt.db"
    cors_origins: str = "http://localhost:3000"
    upload_dir: str = "./storage/receipts"
    max_upload_size_mb: int = 10
    ocr_provider: str = "null"
    upstage_api_key: str | None = None
    upstage_api_base: str = "https://api.upstage.ai/v1"
    upstage_ocr_model: str = "information-extract"
    upstage_timeout_seconds: float = 60.0
    app_env: str = "development"
    log_level: str = "INFO"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def upload_path(self) -> Path:
        return Path(self.upload_dir).resolve()


settings = Settings()
