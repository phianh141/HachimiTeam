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
from ml.predictor import get_predictor

router = APIRouter(prefix="/predict", tags=["Prediction"])


def score_to_confidence(score: float) -> str:
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
    drug = db.query(Drug).filter(Drug.drug_id == request.drug_id).first()
    disease = db.query(Disease).filter(Disease.disease_id == request.disease_id).first()

    if not drug:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    # Kiểm tra cache trước
    cached = db.query(PredictionScore).filter(
        PredictionScore.drug_id == request.drug_id,
        PredictionScore.disease_id == request.disease_id
    ).first()

    if cached:
        score = cached.score
    else:
        # Gọi ML model thật
        predictor = get_predictor("lightgbm")
        score = predictor.predict_single(drug.drug_name, disease.disease_name)

        # Lưu vào cache
        db.add(PredictionScore(
            drug_id=request.drug_id,
            disease_id=request.disease_id,
            score=score,
            model_version="lightgbm-v1.0"
        ))
        db.commit()

    return PredictSingleResponse(
        drug_id=drug.drug_id,
        disease_id=disease.disease_id,
        drug_name=drug.drug_name,
        disease_name=disease.disease_name,
        score=round(score, 4),
        confidence=score_to_confidence(score)
    )


@router.get("/top5/{disease_id}", response_model=Top5Response)
def get_top5(
    disease_id: int,
    db: Session = Depends(get_db)
):
    disease = db.query(Disease).filter(Disease.disease_id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    # Đếm tổng số drugs trong DB
    total_drugs = db.query(Drug).count()
    k = min(5, total_drugs)  # top k = 5 hoặc ít hơn nếu DB ít drugs

    # Kiểm tra cache có đủ k kết quả không
    cached = db.query(PredictionScore, Drug)\
               .join(Drug, PredictionScore.drug_id == Drug.drug_id)\
               .filter(PredictionScore.disease_id == disease_id)\
               .order_by(PredictionScore.score.desc())\
               .limit(k).all()

    if len(cached) >= k:
        # Cache đủ → dùng luôn
        top_drugs = [
            TopDrugItem(
                drug_id=drug.drug_id,
                drug_name=drug.drug_name,
                score=round(ps.score, 4),
                confidence=score_to_confidence(ps.score)
            )
            for ps, drug in cached
        ]
    else:
        # Cache chưa đủ → batch predict tất cả drugs
        all_drugs = db.query(Drug).all()
        predictor = get_predictor("lightgbm")

        drug_names = [d.drug_name for d in all_drugs]
        scores = predictor.predict_batch(drug_names, disease.disease_name)

        # Lưu tất cả vào cache
        cached_drug_ids = {ps.drug_id for ps, _ in cached}
        for drug, score in zip(all_drugs, scores):
            if drug.drug_id not in cached_drug_ids:
                db.add(PredictionScore(
                    drug_id=drug.drug_id,
                    disease_id=disease_id,
                    score=score,
                    model_version="lightgbm-v1.0"
                ))
        db.commit()

        # Sort và lấy top k
        drug_scores = sorted(
            zip(all_drugs, scores),
            key=lambda x: x[1],
            reverse=True
        )[:k]

        top_drugs = [
            TopDrugItem(
                drug_id=drug.drug_id,
                drug_name=drug.drug_name,
                score=round(score, 4),
                confidence=score_to_confidence(score)
            )
            for drug, score in drug_scores
        ]

    return Top5Response(
        disease_id=disease.disease_id,
        disease_name=disease.disease_name,
        top_drugs=top_drugs
    )