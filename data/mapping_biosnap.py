"""Map BioSNAP DrugBank and MeSH IDs to human-readable names via PubChem and NIH MeSH APIs."""

import logging
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import pandas as pd
import requests

BIOSNAP_PATH = Path("data/raw/BioSNAP/DCh-Miner_miner-disease-chemical.tsv.gz")
DRUG_MAPPING_PATH = Path("data/raw/BioSNAP/drug_mapping.csv")
DISEASE_MAPPING_PATH = Path("data/raw/BioSNAP/disease_mapping.csv")

MAX_WORKERS = 5
PROGRESS_INTERVAL = 100
REQUEST_TIMEOUT = 30

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def load_biosnap() -> pd.DataFrame:
    return pd.read_csv(BIOSNAP_PATH, sep="\t", compression="gzip")


def load_cache(path: Path, id_col: str, name_col: str) -> pd.DataFrame:
    if path.exists():
        return pd.read_csv(path)
    return pd.DataFrame(columns=[id_col, name_col])


def save_mapping(path: Path, existing: pd.DataFrame, new_rows: list[dict], id_col: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if new_rows:
        updated = pd.concat([existing, pd.DataFrame(new_rows)], ignore_index=True)
        updated = updated.drop_duplicates(subset=[id_col], keep="first")
        updated.to_csv(path, index=False)
    elif not path.exists() and not existing.empty:
        existing.to_csv(path, index=False)


def fetch_drug_name(db_id: str) -> tuple[str, str] | None:
    url = (
        f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/substance/"
        f"sourceid/drugbank/{db_id}/JSON"
    )
    try:
        response = requests.get(url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        data = response.json()
        name = data["PC_Substances"][0]["synonyms"][0]
        return db_id, name
    except Exception as exc:
        logger.error("Drug API failed for %s: %s", db_id, exc)
        return None


def normalize_mesh_id(disease_id: str) -> str:
    return disease_id.removeprefix("MESH:")


def fetch_disease_name(disease_id: str) -> tuple[str, str] | None:
    mesh_id = normalize_mesh_id(disease_id)
    url = f"https://id.nlm.nih.gov/mesh/{mesh_id}.json"
    try:
        response = requests.get(url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        data = response.json()
        name = data["label"]["@value"]
        return disease_id, name
    except Exception as exc:
        logger.error("Disease API failed for %s (mesh_id=%s): %s", disease_id, mesh_id, exc)
        return None


def map_ids(
    ids: list[str],
    fetch_fn,
    cache_path: Path,
    id_col: str,
    name_col: str,
    label: str,
) -> None:
    cache = load_cache(cache_path, id_col, name_col)
    cached_ids = set(cache[id_col].astype(str)) if not cache.empty else set()
    to_process = [i for i in ids if i not in cached_ids]

    print(f"{label}: {len(cached_ids)} cached, {len(to_process)} to fetch")

    if not to_process:
        return

    new_rows: list[dict] = []
    processed = 0
    lock = threading.Lock()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_fn, entity_id): entity_id for entity_id in to_process}
        for future in as_completed(futures):
            result = future.result()
            if result:
                entity_id, name = result
                new_rows.append({id_col: entity_id, name_col: name})

            with lock:
                processed += 1
                if processed % PROGRESS_INTERVAL == 0:
                    print(f"{label}: processed {processed}/{len(to_process)}")

    save_mapping(cache_path, cache, new_rows, id_col)
    print(f"{label}: done — {len(new_rows)} new mappings saved to {cache_path}")


def main() -> None:
    print(f"Loading BioSNAP from {BIOSNAP_PATH}")
    df = load_biosnap()

    drug_ids = df["Chemical"].dropna().unique().tolist()
    disease_ids = df["# Disease(MESH)"].dropna().unique().tolist()

    print(f"Found {len(drug_ids)} unique drug IDs, {len(disease_ids)} unique disease IDs")

    map_ids(
        drug_ids,
        fetch_drug_name,
        DRUG_MAPPING_PATH,
        id_col="drug_id",
        name_col="drug_name",
        label="Drugs",
    )
    map_ids(
        disease_ids,
        fetch_disease_name,
        DISEASE_MAPPING_PATH,
        id_col="disease_id",
        name_col="disease_name",
        label="Diseases",
    )


if __name__ == "__main__":
    main()
