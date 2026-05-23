from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "DDA System"
    database_url: str
    debug: bool = False
    secret_key: str 
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()