from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "DDA System"
    database_url: str
    debug: bool = False

    class Config:
        env_file = ".env"

# Tạo 1 instance dùng chung cho toàn bộ project
settings = Settings()