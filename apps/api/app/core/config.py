from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Chartes.Tech"
    app_version: str = "0.1.0"
    app_env: str = "development"
    debug: bool = True

    # AWS & DynamoDB Configuration
    aws_region: str = "us-east-1"
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    dynamodb_endpoint_url: str | None = None

    # Table Names (PRD Pragmatic 3-Table Design)
    dynamodb_table_users_workspaces: str = "chartes_users_workspaces"
    dynamodb_table_social_accounts: str = "chartes_social_accounts"
    dynamodb_table_posts_jobs: str = "chartes_posts_jobs"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
