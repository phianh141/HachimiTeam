from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "DDA System"
    database_url: str
    debug: bool = False
    secret_key: str 
    access_token_expire_minutes: int = 60
    google_client_id: str = ""
    google_client_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()