import pytest
from botocore.exceptions import EndpointConnectionError
from httpx import ASGITransport, AsyncClient

from app.db.dependencies import get_db
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "environment" in data


@pytest.mark.asyncio
async def test_database_health_check_connected():
    class MockDynamoClient:
        def describe_limits(self):
            return {"AccountMaxReadCapacityUnits": 80000}

    app.dependency_overrides[get_db] = lambda: MockDynamoClient()

    try:
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/health/database")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "ok"
            assert data["database"] == "dynamodb"
            assert data["connected"] is True
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_database_health_check_disconnected():
    class MockFailingDynamoClient:
        def describe_limits(self):
            raise EndpointConnectionError(endpoint_url="http://invalid:8000")

    app.dependency_overrides[get_db] = lambda: MockFailingDynamoClient()

    try:
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/health/database")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "degraded"
            assert data["database"] == "dynamodb"
            assert data["connected"] is False
    finally:
        app.dependency_overrides.clear()
