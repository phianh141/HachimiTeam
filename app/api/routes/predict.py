from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.models import Drug, Disease, PredictionScore, PredictionHistory
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
    db: Session = Depends(get_db),
    credentials=Security(HTTPBearer(auto_error=False))
):
    """F1 — Dự đoán xác suất liên kết của một cặp thuốc-bệnh"""
    drug = db.query(Drug).filter(Drug.drug_id == request.drug_id).first()
    disease = db.query(Disease).filter(Disease.disease_id == request.disease_id).first()

    if not drug:
        raise HTTPException(status_code=404, detail="Không tìm thấy thuốc")
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    cached = db.query(PredictionScore).filter(
        PredictionScore.drug_id == request.drug_id,
        PredictionScore.disease_id == request.disease_id
    ).first()

    if cached:
        score = cached.score
    else:
        predictor = get_predictor("lightgbm")
        score = predictor.predict_single(drug.drug_name, disease.disease_name)
        db.add(PredictionScore(
            drug_id=request.drug_id,
            disease_id=request.disease_id,
            score=score,
            model_version="lightgbm-v1.0"
        ))
        db.commit()

    # Lưu history nếu user đã đăng nhập
    if credentials:
        payload = decode_access_token(credentials.credentials)
        if payload:
            db.add(PredictionHistory(
                user_id=int(payload["sub"]),
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
    """F2 — Trả về Top 5 thuốc có xác suất cao nhất cho một bệnh"""
    disease = db.query(Disease).filter(Disease.disease_id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh")

    total_drugs = db.query(Drug).count()
    k = min(5, total_drugs)

    cached = db.query(PredictionScore, Drug)\
               .join(Drug, PredictionScore.drug_id == Drug.drug_id)\
               .filter(PredictionScore.disease_id == disease_id)\
               .order_by(PredictionScore.score.desc())\
               .limit(k).all()

    if len(cached) >= k:
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
        all_drugs = db.query(Drug).all()
        predictor = get_predictor("lightgbm")
        drug_names = [d.drug_name for d in all_drugs]
        scores = predictor.predict_batch(drug_names, disease.disease_name)

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