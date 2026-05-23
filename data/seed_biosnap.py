"""Import BioSNAP drug and disease mappings into PostgreSQL."""

import os
import sys
from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent
os.chdir(PROJECT_ROOT)
sys.path.append(".")

from app.core.database import SessionLocal
from app.models.models import Disease, Drug, PredictionScore

DRUG_MAPPING_PATH = PROJECT_ROOT / "data/raw/BioSNAP/drug_mapping.csv"
DISEASE_MAPPING_PATH = PROJECT_ROOT / "data/raw/BioSNAP/disease_mapping.csv"
CTD_DISEASES_PATH = PROJECT_ROOT / "data/raw/BioSNAP/CTD_diseases.csv.gz"

BATCH_SIZE = 100
PROGRESS_INTERVAL = 500

CTD_DISEASE_COLUMNS = [
    "DiseaseName",
    "DiseaseID",
    "AltDiseaseIDs",
    "Definition",
    "ParentIDs",
    "TreeNumbers",
    "ParentTreeNumbers",
    "Synonyms",
    "SlimMappings",
]


def load_drug_mapping() -> pd.DataFrame:
    return pd.read_csv(DRUG_MAPPING_PATH)


def load_disease_mapping() -> pd.DataFrame:
    disease_mapping = pd.read_csv(DISEASE_MAPPING_PATH)
    ctd_diseases = pd.read_csv(
        CTD_DISEASES_PATH,
        compression="gzip",
        skiprows=29,
        header=None,
        names=CTD_DISEASE_COLUMNS,
        usecols=["DiseaseName", "DiseaseID"],
    )
    ctd_diseases = ctd_diseases.rename(
        columns={"DiseaseID": "disease_id", "DiseaseName": "disease_name"}
    )

    combined = pd.concat(
        [disease_mapping[["disease_id", "disease_name"]], ctd_diseases],
        ignore_index=True,
    )
    return combined.drop_duplicates(subset=["disease_id"], keep="first")


def clear_tables(db) -> None:
    deleted_scores = db.query(PredictionScore).delete()
    db.commit()
    print(f"Deleted {deleted_scores} rows from prediction_scores")

    deleted_drugs = db.query(Drug).delete()
    db.commit()
    print(f"Deleted {deleted_drugs} rows from drugs")

    deleted_diseases = db.query(Disease).delete()
    db.commit()
    print(f"Deleted {deleted_diseases} rows from diseases")


def is_valid_name(name) -> bool:
    if name is None or (isinstance(name, float) and pd.isna(name)):
        return False
    return str(name).strip() != ""


def import_drugs(db, drug_mapping: pd.DataFrame) -> int:
    inserted = 0
    batch: list[Drug] = []

    for drug_name in drug_mapping["drug_name"]:
        if not is_valid_name(drug_name):
            continue

        batch.append(Drug(drug_name=str(drug_name).strip()))
        inserted += 1

        if len(batch) >= BATCH_SIZE:
            db.add_all(batch)
            db.commit()
            batch = []

        if inserted % PROGRESS_INTERVAL == 0 and inserted > 0:
            print(f"  Drugs progress: {inserted} inserted")

    if batch:
        db.add_all(batch)
        db.commit()

    return inserted


def import_diseases(db, disease_df: pd.DataFrame) -> int:
    inserted = 0
    batch: list[Disease] = []

    for disease_name in disease_df["disease_name"]:
        if not is_valid_name(disease_name):
            continue

        batch.append(Disease(disease_name=str(disease_name).strip()))
        inserted += 1

        if len(batch) >= BATCH_SIZE:
            db.add_all(batch)
            db.commit()
            batch = []

        if inserted % PROGRESS_INTERVAL == 0 and inserted > 0:
            print(f"  Diseases progress: {inserted} inserted")

    if batch:
        db.add_all(batch)
        db.commit()

    return inserted


def main() -> None:
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Loading drug mapping from {DRUG_MAPPING_PATH}")
    drug_mapping = load_drug_mapping()
    print(f"  Drug records: {len(drug_mapping)}")

    print(f"Loading disease mapping from {DISEASE_MAPPING_PATH}")
    print(f"Merging CTD diseases from {CTD_DISEASES_PATH}")
    disease_df = load_disease_mapping()
    print(f"  Final disease records: {len(disease_df)}")

    db = SessionLocal()
    try:
        print("\nClearing existing data...")
        clear_tables(db)

        print("\nImporting drugs...")
        drugs_inserted = import_drugs(db, drug_mapping)
        print(f"Total drugs inserted: {drugs_inserted}")

        print("\nImporting diseases...")
        diseases_inserted = import_diseases(db, disease_df)
        print(f"Total diseases inserted: {diseases_inserted}")

        total_drugs = db.query(Drug).count()
        total_diseases = db.query(Disease).count()

        print("\nFinal summary")
        print(f"  Total drugs in DB: {total_drugs}")
        print(f"  Total diseases in DB: {total_diseases}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
