from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =============================================
# DRUG SCHEMAS
# =============================================

class DrugCreate(BaseModel):
    """Dữ liệu cần thiết khi tạo mới một thuốc"""
    drug_name: str
    description: Optional[str] = None


class DrugResponse(BaseModel):
    """Dữ liệu trả về khi query thuốc"""
    drug_id: int
    drug_name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # cho phép đọc từ SQLAlchemy object


# =============================================
# DISEASE SCHEMAS
# =============================================

class DiseaseCreate(BaseModel):
    """Dữ liệu cần thiết khi tạo mới một bệnh"""
    disease_name: str
    description: Optional[str] = None


class DiseaseResponse(BaseModel):
    """Dữ liệu trả về khi query bệnh"""
    disease_id: int
    disease_name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =============================================
# PREDICTION SCHEMAS — F1 và F2
# =============================================

class PredictSingleRequest(BaseModel):
    """F1 — Request: người dùng gửi lên cặp drug_id + disease_id"""
    drug_id: int
    disease_id: int


class PredictSingleResponse(BaseModel):
    """F1 — Response: trả về xác suất liên kết"""
    drug_id: int
    disease_id: int
    drug_name: str
    disease_name: str
    score: float        # xác suất từ 0.0 đến 1.0
    confidence: str     # "High", "Medium", "Low"


class TopDrugItem(BaseModel):
    """Một item trong danh sách Top 5"""
    drug_id: int
    drug_name: str
    score: float
    confidence: str


class Top5Response(BaseModel):
    """F2 — Response: trả về Top 5 thuốc cho một bệnh"""
    disease_id: int
    disease_name: str
    top_drugs: list[TopDrugItem]

# =============================================
# AUTH SCHEMAS
# =============================================

class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    role: str
    is_active: int

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LoginRequest(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

# =============================================
# PREDICTION HISTORY SCHEMAS
# =============================================

class PredictionHistoryResponse(BaseModel):
    id: int
    drug_id: int
    disease_id: int
    drug_name: str
    disease_name: str
    score: float
    confidence: str
    model_version: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True