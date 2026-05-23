"""Process BioSNAP drug-disease pairs into a labeled DDA dataset with negative sampling."""

from pathlib import Path

import numpy as np
import pandas as pd

dataset_path = r"C:\GitHub Project\dda - backend\data\raw\BioSNAP"

BIOSNAP_PATH = Path(dataset_path, "DCh-Miner_miner-disease-chemical.tsv.gz")
DRUG_MAPPING_PATH = Path(dataset_path, "drug_mapping.csv")
DISEASE_MAPPING_PATH = Path(dataset_path, "disease_mapping.csv")
CTD_CHEMICALS_PATH = Path(dataset_path, "CTD_chemicals.csv.gz")
CTD_DISEASES_PATH = Path(dataset_path, "CTD_diseases.csv.gz")
OUTPUT_PATH = Path(r"C:\GitHub Project\dda - backend\data\processed\dda_dataset.csv")

RANDOM_SEED = 42
OUTPUT_COLUMNS = ["drug_id", "drug_name", "disease_id", "disease_name", "label"]


def load_biosnap() -> pd.DataFrame:
    df = pd.read_csv(BIOSNAP_PATH, sep="\t", compression="gzip")
    return df.rename(columns={"# Disease(MESH)": "disease_id", "Chemical": "drug_id"})


def load_drug_mapping() -> pd.DataFrame:
    return pd.read_csv(DRUG_MAPPING_PATH)


def load_disease_mapping() -> pd.DataFrame:
    return pd.read_csv(DISEASE_MAPPING_PATH)


def load_ctd_chemicals() -> pd.DataFrame:
    return pd.read_csv(
        CTD_CHEMICALS_PATH,
        compression="gzip",
        skiprows=29,
        header=None,
        names=[
            "ChemicalName", "ChemicalID", "CasRN", "PubChemCID", "PubChemSID",
            "DTXSID", "InChIKey", "Definition", "ParentIDs", "TreeNumbers",
            "ParentTreeNumbers", "MESHSynonyms", "CTDCuratedSynonyms"
        ],
        usecols=["ChemicalName", "ChemicalID"],
    )


def load_ctd_diseases() -> pd.DataFrame:
    return pd.read_csv(
        CTD_DISEASES_PATH,
        compression="gzip",
        skiprows=29,
        header=None,
        names=[
            "DiseaseName", "DiseaseID", "AltDiseaseIDs", "Definition",
            "ParentIDs", "TreeNumbers", "ParentTreeNumbers", "Synonyms", "SlimMappings"
        ],
        usecols=["DiseaseName", "DiseaseID"],
    )


def build_drug_lookup(drug_mapping: pd.DataFrame) -> dict[str, str]:
    return dict(zip(drug_mapping["drug_id"], drug_mapping["drug_name"]))


def build_ctd_drug_lookup(ctd_chemicals: pd.DataFrame) -> dict[str, str]:
    return dict(zip(ctd_chemicals["ChemicalID"], ctd_chemicals["ChemicalName"]))


def build_disease_lookup(
    ctd_diseases: pd.DataFrame, disease_mapping: pd.DataFrame
) -> dict[str, str]:
    lookup = dict(zip(ctd_diseases["DiseaseID"], ctd_diseases["DiseaseName"]))
    for disease_id, name in zip(disease_mapping["disease_id"], disease_mapping["disease_name"]):
        if disease_id not in lookup:
            lookup[disease_id] = name
    return lookup


def resolve_drug_name(
    drug_id: str, drug_lookup: dict[str, str], ctd_drug_lookup: dict[str, str]
) -> str | float:
    name = drug_lookup.get(drug_id)
    if name is None or (isinstance(name, float) and pd.isna(name)):
        name = ctd_drug_lookup.get(drug_id)
    return name


def apply_names(
    df: pd.DataFrame,
    drug_lookup: dict[str, str],
    ctd_drug_lookup: dict[str, str],
    disease_lookup: dict[str, str],
) -> pd.DataFrame:
    df = df.copy()
    df["drug_name"] = df["drug_id"].apply(
        lambda drug_id: resolve_drug_name(drug_id, drug_lookup, ctd_drug_lookup)
    )
    df["disease_name"] = df["disease_id"].map(disease_lookup)
    return df


def build_combined_drug_lookup(
    drug_lookup: dict[str, str], ctd_drug_lookup: dict[str, str]
) -> dict[str, str]:
    combined = drug_lookup.copy()
    for drug_id, name in ctd_drug_lookup.items():
        if drug_id not in combined:
            combined[drug_id] = name
    return combined


def print_pair_statistics(df: pd.DataFrame, title: str) -> None:
    total = len(df)
    drug_found = df["drug_name"].notna().sum()
    disease_found = df["disease_name"].notna().sum()
    both_found = (df["drug_name"].notna() & df["disease_name"].notna()).sum()

    print(f"\n{title}")
    print(f"  Total pairs: {total}")
    print(f"  Pairs with drug_name found: {drug_found} (missing: {total - drug_found})")
    print(f"  Pairs with disease_name found: {disease_found} (missing: {total - disease_found})")
    print(f"  Pairs with both names found: {both_found} (missing either: {total - both_found})")


def generate_negative_samples(
    positive_df: pd.DataFrame,
    drug_lookup: dict[str, str],
    disease_lookup: dict[str, str],
    n_target: int,
) -> pd.DataFrame:
    rng = np.random.default_rng(RANDOM_SEED)

    drugs_with_names = [k for k, v in drug_lookup.items() if pd.notna(v)]
    disease_to_drugs = positive_df.groupby("disease_id")["drug_id"].apply(set).to_dict()
    eligible_diseases = [
        d for d in disease_to_drugs if d in disease_lookup and pd.notna(disease_lookup[d])
    ]

    if not eligible_diseases or not drugs_with_names:
        print("  Warning: cannot generate negatives — no eligible diseases or drugs with names")
        return pd.DataFrame(columns=OUTPUT_COLUMNS)

    base_per_disease = n_target // len(eligible_diseases)
    extra = n_target % len(eligible_diseases)

    negatives: list[dict] = []
    for i, disease_id in enumerate(eligible_diseases):
        n_needed = base_per_disease + (1 if i < extra else 0)
        if n_needed == 0:
            continue

        excluded = disease_to_drugs[disease_id]
        candidates = [d for d in drugs_with_names if d not in excluded]
        if not candidates:
            continue

        sampled_drugs = rng.choice(
            candidates, size=n_needed, replace=n_needed > len(candidates)
        )
        disease_name = disease_lookup[disease_id]
        for drug_id in sampled_drugs:
            negatives.append(
                {
                    "drug_id": drug_id,
                    "drug_name": drug_lookup[drug_id],
                    "disease_id": disease_id,
                    "disease_name": disease_name,
                    "label": 0,
                }
            )

    if len(negatives) < n_target:
        print(
            f"  Warning: generated {len(negatives)} negative pairs "
            f"(target was {n_target})"
        )

    return pd.DataFrame(negatives)


def print_final_statistics(df: pd.DataFrame) -> None:
    print("\nFinal dataset statistics")
    print(f"  Total pairs: {len(df)}")
    print("  Label distribution:")
    for label, count in df["label"].value_counts().sort_index().items():
        print(f"    label={label}: {count}")
    print(f"  Unique drugs: {df['drug_id'].nunique()}")
    print(f"  Unique diseases: {df['disease_id'].nunique()}")


def main() -> None:
    print("Loading BioSNAP...")
    biosnap = load_biosnap()

    # Chỉ lấy drug_id có trong BioSNAP — không dùng CTD chemicals
    biosnap_drug_ids = set(biosnap["drug_id"].unique())

    print("Loading mappings and CTD reference files...")
    drug_mapping = load_drug_mapping()
    disease_mapping = load_disease_mapping()
    ctd_chemicals = load_ctd_chemicals()
    ctd_diseases = load_ctd_diseases()

    drug_lookup = build_drug_lookup(drug_mapping)
    ctd_drug_lookup = build_ctd_drug_lookup(ctd_chemicals)
    disease_lookup = build_disease_lookup(ctd_diseases, disease_mapping)

    # combined_drug_lookup chỉ giữ lại drug_id có trong BioSNAP
    combined_drug_lookup = {
        drug_id: name
        for drug_id, name in build_combined_drug_lookup(drug_lookup, ctd_drug_lookup).items()
        if drug_id in biosnap_drug_ids
    }

    pairs = apply_names(biosnap, drug_lookup, ctd_drug_lookup, disease_lookup)
    pairs["label"] = 1

    print_pair_statistics(pairs, "Positive pairs (before negative sampling)")

    n_positives = len(pairs)
    print(f"\nGenerating {n_positives} negative samples (1:1 ratio)...")
    negatives = generate_negative_samples(
        pairs, combined_drug_lookup, disease_lookup, n_positives
    )

    positives_out = pairs[OUTPUT_COLUMNS]
    dataset = pd.concat([positives_out, negatives], ignore_index=True)
    dataset = dataset.sample(frac=1, random_state=RANDOM_SEED).reset_index(drop=True)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    dataset.to_csv(OUTPUT_PATH, index=False)
    print(f"\nSaved dataset to {OUTPUT_PATH}")

    print_final_statistics(dataset)


if __name__ == "__main__":
    main()