"""Import drug-drug interaction data from TWOSIDES into PostgreSQL."""

import os
import sys
from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent
os.chdir(PROJECT_ROOT)
sys.path.append(".")

from app.core.database import SessionLocal
from app.models.models import Drug, DrugInteraction

DDI_DATASET_PATH = PROJECT_ROOT / "data/raw/drug vs drug/db_drug_interactions.csv"

BATCH_SIZE = 100
PROGRESS_INTERVAL = 1000
SOURCE = "TWOSIDES"


def load_ddi_dataset() -> pd.DataFrame:
    df = pd.read_csv(DDI_DATASET_PATH)
    df = df.dropna(subset=["Drug 1", "Drug 2", "Interaction Description"])
    return df


def build_drug_name_lookup(db) -> dict[str, int]:
    drugs = db.query(Drug.drug_id, Drug.drug_name).all()
    return {drug_name.lower(): drug_id for drug_id, drug_name in drugs}


def clear_interactions(db) -> int:
    deleted = db.query(DrugInteraction).delete()
    db.commit()
    return deleted


def import_interactions(db, ddi_df: pd.DataFrame, name_lookup: dict[str, int]) -> dict[str, int]:
    stats = {
        "processed": 0,
        "inserted": 0,
        "skipped_not_found": 0,
        "skipped_duplicate": 0,
    }
    seen_pairs: set[tuple[int, int]] = set()
    batch: list[DrugInteraction] = []

    for drug1_name, drug2_name, description in zip(
        ddi_df["Drug 1"],
        ddi_df["Drug 2"],
        ddi_df["Interaction Description"],
    ):
        stats["processed"] += 1

        drug1_id = name_lookup.get(str(drug1_name).lower())
        drug2_id = name_lookup.get(str(drug2_name).lower())

        if drug1_id is None or drug2_id is None:
            stats["skipped_not_found"] += 1
            continue

        if drug1_id == drug2_id:
            continue

        drug_a_id = min(drug1_id, drug2_id)
        drug_b_id = max(drug1_id, drug2_id)
        pair_key = (drug_a_id, drug_b_id)

        if pair_key in seen_pairs:
            stats["skipped_duplicate"] += 1
            continue

        seen_pairs.add(pair_key)
        batch.append(
            DrugInteraction(
                drug_a_id=drug_a_id,
                drug_b_id=drug_b_id,
                description=str(description),
                source=SOURCE,
            )
        )
        stats["inserted"] += 1

        if len(batch) >= BATCH_SIZE:
            db.add_all(batch)
            db.commit()
            batch = []

        if stats["processed"] % PROGRESS_INTERVAL == 0:
            print(f"  Progress: {stats['processed']} processed, {stats['inserted']} inserted")

    if batch:
        db.add_all(batch)
        db.commit()

    return stats


def main() -> None:
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Loading DDI dataset from {DDI_DATASET_PATH}")
    ddi_df = load_ddi_dataset()
    print(f"  DDI records: {len(ddi_df)}")

    db = SessionLocal()
    try:
        name_lookup = build_drug_name_lookup(db)
        print(f"  Drugs loaded from DB: {len(name_lookup)}")

        print("\nClearing existing drug_interactions...")
        deleted = clear_interactions(db)
        print(f"Deleted {deleted} rows from drug_interactions")

        print("\nImporting interactions...")
        stats = import_interactions(db, ddi_df, name_lookup)

        total_in_db = db.query(DrugInteraction).count()

        print("\nFinal summary")
        print(f"  Total pairs processed: {stats['processed']}")
        print(f"  Total inserted: {stats['inserted']}")
        print(f"  Total skipped (drug not found in DB): {stats['skipped_not_found']}")
        print(f"  Total skipped (duplicate): {stats['skipped_duplicate']}")
        print(f"  Total drug_interactions in DB: {total_in_db}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
