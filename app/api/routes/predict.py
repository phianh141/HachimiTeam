from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Drug, Disease, PredictionScore
from app.schemas.schemas import (
    PredictSingleRequest,
    PredictSingleResponse,
    Top5Response,
    TopDrugItem
)

router = APIRouter(prefix="/predict", tags=["Prediction"])


def score_to_confidence(score: float) -> str:
    """Chuyển điểm số thành mức độ tin cậy"""
    if score >= 0.7:
        return "High"
    elif score >= 0.4:
        return "Medium"
    return "Low"


@router.post("/single", response_model=PredictSingleResponse)
def predict_single(
    request: PredictSingleRequest,
    db: Session = Depends(get_db)
):
    """F1 — Dự đoán xác suất liên kết của một cặp thuốc-bệnh"""
    drug = db.query(Drug)\
             .filter(Drug.drug_id == request.drug_id)\
             .first()
    disease = db.query(Disease)\
                .filter(Disease.disease_id == request.disease_id)\
                .first()

    if not drug:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    # Kiểm tra đã có precomputed score chưa
    cached = db.query(PredictionScore).filter(
        PredictionScore.drug_id == request.drug_id,
        PredictionScore.disease_id == request.disease_id
    ).first()

    if cached:
        score = cached.score
    else:
        # Tuần 2 thay đoạn này bằng ML model thật
        # score = predictor.predict_single(request.drug_id, request.disease_id)
        score = 0.0  # placeholder

    return PredictSingleResponse(
        drug_id=drug.drug_id,
        disease_id=disease.disease_id,
        drug_name=drug.drug_name,
        disease_name=disease.disease_name,
        score=score,
        confidence=score_to_confidence(score)
    )


@router.get("/top5/{disease_id}", response_model=Top5Response)
def get_top5(
    disease_id: int,
    db: Session = Depends(get_db)
):
    """F2 — Trả về Top 5 thuốc có xác suất cao nhất cho một bệnh"""
    disease = db.query(Disease)\
                .filter(Disease.disease_id == disease_id)\
                .first()
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    # Đọc từ precomputed scores, sort sẵn, lấy Top 5
    scores = db.query(PredictionScore, Drug)\
               .join(Drug, PredictionScore.drug_id == Drug.drug_id)\
               .filter(PredictionScore.disease_id == disease_id)\
               .order_by(PredictionScore.score.desc())\
               .limit(5).all()

    top_drugs = [
        TopDrugItem(
            drug_id=drug.drug_id,
            drug_name=drug.drug_name,
            score=ps.score,
            confidence=score_to_confidence(ps.score)
        )
        for ps, drug in scores
    ]

    return Top5Response(
        disease_id=disease.disease_id,
        disease_name=disease.disease_name,
        top_drugs=top_drugs
    )