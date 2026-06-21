from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, PredictionHistory, Drug, Disease
from app.schemas.schemas import PredictionHistoryResponse
from app.core.security import (
    hash_password, verify_password,
    create_access_token, decode_access_token
)
import shutil
import uuid
import os
from app.models.models import User
from app.schemas.schemas import (
    UserRegister, UserResponse,
    TokenResponse, LoginRequest
)
from pydantic import BaseModel
from app.schemas.schemas import (
    UserRegister, UserResponse,
    TokenResponse, LoginRequest,
    ChangePasswordRequest, UpdateProfileRequest
)


router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user: UserRegister, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới"""
    # Kiểm tra email đã tồn tại chưa
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email đã được sử dụng"
        )

    # Kiểm tra username đã tồn tại chưa
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=400,
            detail="Username đã được sử dụng"
        )

    db_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role="user",
        is_active=1
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập và nhận JWT token"""
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, str(user.password)):
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Tài khoản đã bị vô hiệu hóa"
        )

    token = create_access_token({"sub": str(user.user_id), "role": user.role})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Lấy thông tin user hiện tại từ JWT token"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )

    user = db.query(User).filter(
        User.user_id == int(payload["sub"])
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    return user

@router.get("/history", response_model=list[PredictionHistoryResponse])
def get_prediction_history(
    skip: int = 0,
    limit: int = 20,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Lấy lịch sử dự đoán của user hiện tại"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user_id = int(payload["sub"])

    history = db.query(PredictionHistory, Drug, Disease)\
                .join(Drug, PredictionHistory.drug_id == Drug.drug_id)\
                .join(Disease, PredictionHistory.disease_id == Disease.disease_id)\
                .filter(PredictionHistory.user_id == user_id)\
                .order_by(PredictionHistory.created_at.desc())\
                .offset(skip).limit(limit).all()

    result = []
    for record, drug, disease in history:
        score = record.score
        confidence = "High" if score >= 0.7 else "Medium" if score >= 0.4 else "Low"
        result.append(PredictionHistoryResponse(
            id=record.id,
            drug_id=record.drug_id,
            disease_id=record.disease_id,
            drug_name=drug.drug_name,
            disease_name=disease.disease_name,
            score=round(score, 4),
            confidence=confidence,
            model_version=record.model_version,
            created_at=record.created_at
        ))

    return result


@router.delete("/history/{history_id}", status_code=204)
def delete_history(
    history_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Xóa một record lịch sử dự đoán"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user_id = int(payload["sub"])
    record = db.query(PredictionHistory).filter(
        PredictionHistory.id == history_id,
        PredictionHistory.user_id == user_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Không tìm thấy record")

    db.delete(record)
    db.commit()

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.put("/change-password", status_code=200)
def change_password(
    request: ChangePasswordRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Đổi mật khẩu user hiện tại"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user = db.query(User).filter(User.user_id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    # Kiểm tra password hiện tại
    if not verify_password(request.current_password, str(user.password)):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không đúng")

    # Kiểm tra password mới không trùng password cũ
    if request.current_password == request.new_password:
        raise HTTPException(status_code=400, detail="Mật khẩu mới không được trùng mật khẩu cũ")

    # Kiểm tra độ dài password mới
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự")

    user.password = hash_password(request.new_password) # type: ignore
    db.commit()

    return {"message": "Đổi mật khẩu thành công"}


@router.put("/update-profile", response_model=UserResponse)
def update_profile(
    request: UpdateProfileRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin user hiện tại"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user = db.query(User).filter(User.user_id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    # Kiểm tra xem username mới có bị trùng không
    if request.username != user.username:
        existing_user = db.query(User).filter(User.username == request.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username đã được sử dụng bởi người khác")
        
        user.username = request.username # type: ignore
        db.commit()
        db.refresh(user)

    return user


@router.post("/upload-avatar", response_model=UserResponse)
def upload_avatar(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Upload và cập nhật ảnh đại diện"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user = db.query(User).filter(User.user_id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    # Kiểm tra định dạng file
    if not file.filename:
        raise HTTPException(status_code=400, detail="File upload không hợp lệ")

    allowed_extensions = ["jpg", "jpeg", "png", "gif"]
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF.")

    # Lưu file
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = f"app/static/avatars/{filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Xóa ảnh cũ nếu có
    if user.avatar_url:
        old_file_path = f"app{user.avatar_url}"
        if os.path.exists(old_file_path):
            try:
                os.remove(old_file_path)
            except Exception:
                pass
                
    user.avatar_url = f"/static/avatars/{filename}" # type: ignore
    db.commit()
    db.refresh(user)

    return user