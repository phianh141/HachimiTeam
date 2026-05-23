from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token, hash_password
from app.models.models import User, PredictionHistory
from app.schemas.schemas import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()


def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency — chỉ cho phép admin truy cập"""
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user = db.query(User).filter(User.user_id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền")

    return user


# =============================================
# QUẢN LÝ USER
# =============================================

@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Lấy danh sách tất cả users"""
    return db.query(User).offset(skip).limit(limit).all()


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Lấy thông tin một user theo ID"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")
    return user


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Thay đổi role của user (user/admin)"""
    if role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Role phải là 'user' hoặc 'admin'")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    user.role = role
    db.commit()
    return {"message": f"Đã cập nhật role thành {role}", "user_id": user_id}


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Kích hoạt hoặc vô hiệu hóa tài khoản user"""
    if is_active not in (0, 1):
        raise HTTPException(status_code=400, detail="is_active phải là 0 hoặc 1")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    user.is_active = is_active
    db.commit()
    status = "kích hoạt" if is_active else "vô hiệu hóa"
    return {"message": f"Đã {status} tài khoản", "user_id": user_id}


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Xóa một user"""
    if user_id == current_admin.user_id:
        raise HTTPException(status_code=400, detail="Không thể tự xóa tài khoản của mình")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    # Xóa history của user trước
    db.query(PredictionHistory).filter(
        PredictionHistory.user_id == user_id
    ).delete()

    db.delete(user)
    db.commit()


# =============================================
# THỐNG KÊ HỆ THỐNG
# =============================================

@router.get("/stats")
def get_system_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Thống kê tổng quan hệ thống"""
    from app.models.models import Drug, Disease, PredictionScore, DrugInteraction

    return {
        "total_users": db.query(User).count(),
        "total_drugs": db.query(Drug).count(),
        "total_diseases": db.query(Disease).count(),
        "total_predictions": db.query(PredictionScore).count(),
        "total_interactions": db.query(DrugInteraction).count(),
        "total_history": db.query(PredictionHistory).count(),
        "active_users": db.query(User).filter(User.is_active == 1).count(),
    }