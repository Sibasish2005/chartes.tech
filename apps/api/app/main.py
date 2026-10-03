from fastapi import FastAPI

from app.core.config import get_settings


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