from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    """Hash password trước khi lưu vào DB — bcrypt giới hạn 72 bytes"""
    return pwd_context.hash(password[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra password người dùng nhập với password đã hash trong DB"""
    return pwd_context.verify(plain_password[:72], hashed_password)


def create_access_token(data: dict) -> str:
    """Tạo JWT token sau khi đăng nhập thành công"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Giải mã JWT token — trả về None nếu token không hợp lệ"""
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except JWTError:
        return None