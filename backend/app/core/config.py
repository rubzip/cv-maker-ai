from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATA_DIR: str = "data"
    DEBUG: bool = False
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
