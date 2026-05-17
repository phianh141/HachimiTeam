from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Disease
from app.schemas.schemas import DiseaseCreate, DiseaseResponse

router = APIRouter(prefix="/diseases", tags=["Diseases"])


@router.get("/", response_model=list[DiseaseResponse])
def get_all_diseases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lấy danh sách tất cả bệnh"""
    return db.query(Disease).offset(skip).limit(limit).all()


@router.get("/search", response_model=list[DiseaseResponse])
def search_diseases(
    name: str,
    db: Session = Depends(get_db)
):
    """Tìm kiếm bệnh theo tên — dùng cho autocomplete"""
    return db.query(Disease)\
             .filter(Disease.disease_name.ilike(f"%{name}%"))\
             .limit(20).all()


@router.get("/{disease_id}", response_model=DiseaseResponse)
def get_disease(
    disease_id: int,
    db: Session = Depends(get_db)
):
    """Lấy thông tin một bệnh theo ID"""
    disease = db.query(Disease)\
                .filter(Disease.disease_id == disease_id)\
                .first()
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")
    return disease


@router.post("/", response_model=DiseaseResponse, status_code=201)
def create_disease(
    disease: DiseaseCreate,
    db: Session = Depends(get_db)
):
    """Tạo mới một bệnh"""
    existing = db.query(Disease)\
                 .filter(Disease.disease_name == disease.disease_name)\
                 .first()
    if existing:
        raise HTTPException(status_code=400, detail="Bệnh này đã tồn tại")

    db_disease = Disease(**disease.model_dump())
    db.add(db_disease)
    db.commit()
    db.refresh(db_disease)
    return db_disease

@router.put("/{disease_id}", response_model=DiseaseResponse)
def update_disease(
    disease_id: int,
    disease: DiseaseCreate,
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin một bệnh"""
    db_disease = db.query(Disease)\
                   .filter(Disease.disease_id == disease_id)\
                   .first()
    if not db_disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    db_disease.disease_name = disease.disease_name
    db_disease.description  = disease.description
    db.commit()
    db.refresh(db_disease)
    return db_disease


@router.delete("/{disease_id}", status_code=204)
def delete_disease(
    disease_id: int,
    db: Session = Depends(get_db)
):
    """Xóa một bệnh"""
    db_disease = db.query(Disease)\
                   .filter(Disease.disease_id == disease_id)\
                   .first()
    if not db_disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    db.delete(db_disease)
    db.commit()