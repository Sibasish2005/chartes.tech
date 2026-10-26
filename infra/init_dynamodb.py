"""DynamoDB table initialization script for Chartes.Tech.

Creates the 3 tables defined in PRD Section 7 with Provisioned Capacity:
1. chartes_users_workspaces (5 RCU / 5 WCU)
2. chartes_social_accounts (5 RCU / 5 WCU)
3. chartes_posts_jobs (10 RCU / 10 WCU)
"""

import os
import sys
import boto3
from botocore.exceptions import ClientError


def get_dynamodb_client():
    endpoint_url = os.getenv("DYNAMODB_ENDPOINT_URL", "http://127.0.0.1:8000")
    region_name = os.getenv("AWS_REGION", "us-east-1")
    return boto3.client(
        "dynamodb",
        endpoint_url=endpoint_url,
        region_name=region_name,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "local"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "local"),
    )


TABLE_SPECS = [
    {
        "TableName": os.getenv("DYNAMODB_TABLE_USERS_WORKSPACES", "chartes_users_workspaces"),
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"},
        ],
        "AttributeDefinitions": [
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
            {"AttributeName": "GSI1PK", "AttributeType": "S"},
            {"AttributeName": "GSI1SK", "AttributeType": "S"},
        ],
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "GSI1",
                "KeySchema": [
                    {"AttributeName": "GSI1PK", "KeyType": "HASH"},
                    {"AttributeName": "GSI1SK", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
            }
        ],
        "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
    },
    {
        "TableName": os.getenv("DYNAMODB_TABLE_SOCIAL_ACCOUNTS", "chartes_social_accounts"),
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"},
        ],
        "AttributeDefinitions": [
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
            {"AttributeName": "GSI1PK", "AttributeType": "S"},
            {"AttributeName": "GSI1SK", "AttributeType": "S"},
        ],
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "GSI1",
                "KeySchema": [
                    {"AttributeName": "GSI1PK", "KeyType": "HASH"},
                    {"AttributeName": "GSI1SK", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
            }
        ],
        "ProvisionedThroughput": {"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
    },
    {
        "TableName": os.getenv("DYNAMODB_TABLE_POSTS_JOBS", "chartes_posts_jobs"),
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"},
        ],
        "AttributeDefinitions": [
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
            {"AttributeName": "GSI1PK", "AttributeType": "S"},
            {"AttributeName": "GSI1SK", "AttributeType": "S"},
        ],
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "GSI1",
                "KeySchema": [
                    {"AttributeName": "GSI1PK", "KeyType": "HASH"},
                    {"AttributeName": "GSI1SK", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL"},
                "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 10},
            }
        ],
        "ProvisionedThroughput": {"ReadCapacityUnits": 10, "WriteCapacityUnits": 10},
    },
]


def init_tables():
    client = get_dynamodb_client()
    existing_tables = set(client.list_tables().get("TableNames", []))

    for spec in TABLE_SPECS:
        name = spec["TableName"]
        if name in existing_tables:
            print(f"Table '{name}' already exists.")
            continue

        print(f"Creating table '{name}'...")
        try:
            client.create_table(**spec)
            print(f"Created table '{name}' successfully.")
        except ClientError as exc:
            print(f"Failed to create table '{name}': {exc}", file=sys.stderr)


if __name__ == "__main__":
    init_tables()
