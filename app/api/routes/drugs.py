from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Drug
from app.schemas.schemas import DrugCreate, DrugResponse

router = APIRouter(prefix="/drugs", tags=["Drugs"])


@router.get("/", response_model=list[DrugResponse])
def get_all_drugs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lấy danh sách tất cả thuốc — dùng cho dropdown ở Frontend"""
    return db.query(Drug).offset(skip).limit(limit).all()


@router.get("/search", response_model=list[DrugResponse])
def search_drugs(
    name: str,
    db: Session = Depends(get_db)
):
    """Tìm kiếm thuốc theo tên — dùng cho autocomplete"""
    return db.query(Drug)\
             .filter(Drug.drug_name.ilike(f"%{name}%"))\
             .limit(20).all()


@router.get("/{drug_id}", response_model=DrugResponse)
def get_drug(
    drug_id: int,
    db: Session = Depends(get_db)
):
    """Lấy thông tin một thuốc theo ID"""
    drug = db.query(Drug).filter(Drug.drug_id == drug_id).first()
    if not drug:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    return drug


@router.post("/", response_model=DrugResponse, status_code=201)
def create_drug(
    drug: DrugCreate,
    db: Session = Depends(get_db)
):
    """Tạo mới một thuốc"""
    # Kiểm tra tên đã tồn tại chưa
    existing = db.query(Drug)\
                 .filter(Drug.drug_name == drug.drug_name)\
                 .first()
    if existing:
        raise HTTPException(status_code=400, detail="Thuốc này đã tồn tại")

    db_drug = Drug(**drug.model_dump())
    db.add(db_drug)
    db.commit()
    db.refresh(db_drug)
    return db_drug

@router.put("/{drug_id}", response_model=DrugResponse)
def update_drug(
    drug_id: int,
    drug: DrugCreate,
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin một thuốc"""
    db_drug = db.query(Drug).filter(Drug.drug_id == drug_id).first()
    if not db_drug:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")

    db_drug.drug_name   = drug.drug_name
    db_drug.description = drug.description
    db.commit()
    db.refresh(db_drug)
    return db_drug


@router.delete("/{drug_id}", status_code=204)
def delete_drug(
    drug_id: int,
    db: Session = Depends(get_db)
):
    """Xóa một thuốc"""
    db_drug = db.query(Drug).filter(Drug.drug_id == drug_id).first()
    if not db_drug:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")

    db.delete(db_drug)
    db.commit()