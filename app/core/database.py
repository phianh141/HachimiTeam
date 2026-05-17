from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

# Engine = "cầu nối" giữa Python và PostgreSQL
engine = create_engine(
    settings.database_url,
    echo=settings.debug  # True thì in SQL ra terminal, tiện debug
)

# SessionLocal = "phiên làm việc" với DB
# Mỗi request HTTP sẽ mở 1 session, xong thì đóng lại
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = lớp cha cho tất cả các model (bảng DB) sau này
class Base(DeclarativeBase):
    pass

# Hàm này sẽ được dùng ở mọi API endpoint cần truy cập DB
def get_db():
    db = SessionLocal()
    try:
        yield db        # trả session cho endpoint dùng
    finally:
        db.close()      # dù có lỗi hay không, luôn đóng session lại