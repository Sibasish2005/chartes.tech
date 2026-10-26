from typing import Annotated, Any

from botocore.exceptions import BotoCoreError, ClientError
from fastapi import Depends, FastAPI

from app.core.config import get_settings
from app.db.dependencies import get_db

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "environment": settings.app_env,
    }


@app.get("/health/database")
async def database_health_check(db: Annotated[Any, Depends(get_db)]):
    try:
        db.describe_limits()
        return {
            "status": "ok",
            "database": "dynamodb",
            "connected": True,
        }
    except (ClientError, BotoCoreError) as exc:
        return {
            "status": "degraded",
            "database": "dynamodb",
            "connected": False,
            "error": str(exc),
        }
