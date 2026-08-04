from fastapi import FastAPI
from app.config import settings
from app.routers import validation, optimization, copilot, health

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(validation.router)
app.include_router(optimization.router)
app.include_router(copilot.router)
app.include_router(health.router)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "ai-core",
        "version": "1.0.0",
        "environment": settings.environment
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to Dashboard Capsule AI Core Engine API"}
