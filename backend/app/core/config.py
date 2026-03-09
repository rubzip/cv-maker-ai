from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/cv_maker"
    DEBUG: bool = False
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
