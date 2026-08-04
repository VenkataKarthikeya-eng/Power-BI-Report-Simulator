import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Dashboard Capsule AI Core Engine"
    environment: str = os.getenv("ENVIRONMENT", "development")
    vector_db_url: str = os.getenv("VECTOR_DB_URL", "http://localhost:6333")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    default_model: str = "gpt-4o"

settings = Settings()
