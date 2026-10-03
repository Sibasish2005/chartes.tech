from fastapi import FastAPI

app = FastAPI(
    title="SaaS Platform API",
    version="0.1.0",
)


@app.get("/")
async def health_check():
    return {"status": "ok"}