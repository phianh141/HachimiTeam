from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Drug, DrugInteraction
from pydantic import BaseModel

router = APIRouter(prefix="/interactions", tags=["Drug Interactions"])


class InteractionCheckRequest(BaseModel):
    drug_names: list[str]  # danh sách tên thuốc cần kiểm tra


class InteractionResult(BaseModel):
    drug_a: str
    drug_b: str
    description: str
    source: str


class InteractionCheckResponse(BaseModel):
    total_drugs: int
    total_pairs_checked: int
    interactions_found: int
    interactions: list[InteractionResult]


@router.post("/check", response_model=InteractionCheckResponse)
def check_interactions(
    request: InteractionCheckRequest,
    db: Session = Depends(get_db)
):
    """F3 — Kiểm tra tương tác giữa danh sách thuốc"""
    if len(request.drug_names) < 2:
        raise HTTPException(
            status_code=400,
            detail="Cần ít nhất 2 thuốc để kiểm tra tương tác"
        )

    if len(request.drug_names) > 10:
        raise HTTPException(
            status_code=400,
            detail="Tối đa 10 thuốc mỗi lần kiểm tra"
        )

    # Tìm drug_id cho từng tên thuốc
    drug_map = {}  # {drug_name_lower: (drug_id, drug_name_original)}
    not_found = []

    for name in request.drug_names:
        drug = db.query(Drug).filter(
            Drug.drug_name.ilike(name)
        ).first()

        if drug:
            drug_map[name.lower()] = (drug.drug_id, drug.drug_name)
        else:
            not_found.append(name)

    if not drug_map:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy thuốc nào trong danh sách"
        )

    # Tạo tất cả các cặp có thể từ danh sách thuốc
    drug_list = list(drug_map.values())
    pairs = []
    for i in range(len(drug_list)):
        for j in range(i + 1, len(drug_list)):
            drug_a_id, drug_a_name = drug_list[i]
            drug_b_id, drug_b_name = drug_list[j]

            # Đảm bảo a < b để match đúng constraint trong DB
            if drug_a_id > drug_b_id:
                drug_a_id, drug_a_name, drug_b_id, drug_b_name = (
                    drug_b_id, drug_b_name, drug_a_id, drug_a_name
                )

            pairs.append((drug_a_id, drug_a_name, drug_b_id, drug_b_name))

    # Kiểm tra từng cặp trong DB
    interactions = []
    for drug_a_id, drug_a_name, drug_b_id, drug_b_name in pairs:
        interaction = db.query(DrugInteraction).filter(
            DrugInteraction.drug_a_id == drug_a_id,
            DrugInteraction.drug_b_id == drug_b_id
        ).first()

        if interaction:
            interactions.append(InteractionResult(
                drug_a=drug_a_name,
                drug_b=drug_b_name,
                description=interaction.description,
                source=interaction.source or "TWOSIDES"
            ))

    return InteractionCheckResponse(
        total_drugs=len(drug_map),
        total_pairs_checked=len(pairs),
        interactions_found=len(interactions),
        interactions=interactions
    )