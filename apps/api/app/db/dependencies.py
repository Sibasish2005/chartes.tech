from typing import Any

from app.db.client import (
    get_dynamodb_client,
    get_dynamodb_resource,
    get_posts_jobs_table,
    get_social_accounts_table,
    get_users_workspaces_table,
)


def get_db() -> Any:
    """Dependency that returns the DynamoDB low-level client."""
    return get_dynamodb_client()


def get_db_resource() -> Any:
    """Dependency that returns the DynamoDB resource."""
    return get_dynamodb_resource()


def get_users_table() -> Any:
    """Dependency that returns the chartes_users_workspaces table."""
    return get_users_workspaces_table()


def get_social_accounts_table_dep() -> Any:
    """Dependency that returns the chartes_social_accounts table."""
    return get_social_accounts_table()


def get_posts_jobs_table_dep() -> Any:
    """Dependency that returns the chartes_posts_jobs table."""
    return get_posts_jobs_table()
