from functools import lru_cache
from typing import Any

import boto3

from app.core.config import get_settings


def _get_boto3_kwargs() -> dict[str, Any]:
    settings = get_settings()
    kwargs: dict[str, Any] = {
        "region_name": settings.aws_region,
    }
    if settings.dynamodb_endpoint_url:
        kwargs["endpoint_url"] = settings.dynamodb_endpoint_url
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        kwargs["aws_access_key_id"] = settings.aws_access_key_id
        kwargs["aws_secret_access_key"] = settings.aws_secret_access_key
    return kwargs


@lru_cache
def get_dynamodb_client() -> Any:
    """Return a cached boto3 DynamoDB low-level client."""
    kwargs = _get_boto3_kwargs()
    return boto3.client("dynamodb", **kwargs)


@lru_cache
def get_dynamodb_resource() -> Any:
    """Return a cached boto3 DynamoDB high-level service resource."""
    kwargs = _get_boto3_kwargs()
    return boto3.resource("dynamodb", **kwargs)


def get_users_workspaces_table() -> Any:
    settings = get_settings()
    dynamodb = get_dynamodb_resource()
    return dynamodb.Table(settings.dynamodb_table_users_workspaces)


def get_social_accounts_table() -> Any:
    settings = get_settings()
    dynamodb = get_dynamodb_resource()
    return dynamodb.Table(settings.dynamodb_table_social_accounts)


def get_posts_jobs_table() -> Any:
    settings = get_settings()
    dynamodb = get_dynamodb_resource()
    return dynamodb.Table(settings.dynamodb_table_posts_jobs)
