import os
import time
import json
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
import lightgbm as lgb
from lightgbm import LGBMClassifier
from sentence_transformers import SentenceTransformer
from sklearn.metrics import accuracy_score, classification_report, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split

os.chdir(Path(__file__).parent.parent)
warnings.filterwarnings("ignore")

DATASET_PATH = Path("data/processed/dda_dataset.csv")
ARTIFACTS_DIR = Path("ml/artifacts/biobert")
EMBEDDING_MODEL = "pritamdeka/S-PubMedBert-MS-MARCO"
EMBEDDING_CACHE = Path("data/processed/biobert_embeddings.npz")
RANDOM_STATE = 42
TEST_SIZE = 0.15
VAL_SIZE = 0.176
BATCH_SIZE = 256


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATASET_PATH)
    df = df.dropna(subset=["drug_name", "disease_name"])
    df["drug_name"] = df["drug_name"].astype(str)
    df["disease_name"] = df["disease_name"].astype(str)
    return df


def generate_embeddings(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray, int]:
    if EMBEDDING_CACHE.exists():
        cache = np.load(EMBEDDING_CACHE)
        drug_embs = cache["drug_embs"]
        disease_embs = cache["disease_embs"]
        embedding_dim = int(drug_embs.shape[1])
        return drug_embs, disease_embs, embedding_dim

    start = time.perf_counter()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = SentenceTransformer(EMBEDDING_MODEL, device=device)

    unique_drugs = df["drug_name"].drop_duplicates().tolist()
    unique_diseases = df["disease_name"].drop_duplicates().tolist()

    drug_unique_embs = model.encode(
        unique_drugs,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        device=device,
    )
    disease_unique_embs = model.encode(
        unique_diseases,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        device=device,
    )

    drug_lookup = dict(zip(unique_drugs, drug_unique_embs))
    disease_lookup = dict(zip(unique_diseases, disease_unique_embs))

    drug_embs = np.vstack([drug_lookup[name] for name in df["drug_name"].tolist()])
    disease_embs = np.vstack(
        [disease_lookup[name] for name in df["disease_name"].tolist()]
    )

    EMBEDDING_CACHE.parent.mkdir(parents=True, exist_ok=True)
    np.savez(EMBEDDING_CACHE, drug_embs=drug_embs, disease_embs=disease_embs)

    embedding_dim = int(drug_embs.shape[1])
    elapsed = time.perf_counter() - start
    print(f"Embedding dim: {embedding_dim}")
    print(f"Embedding generation time: {elapsed:.2f} seconds")
    return drug_embs, disease_embs, embedding_dim


def build_feature_matrix(drug_embs: np.ndarray, disease_embs: np.ndarray) -> np.ndarray:
    features = np.concatenate(
        [drug_embs, disease_embs],
        axis=1,
    )
    print(f"Feature matrix shape: {features.shape}")
    return features


def train_model(X_train, y_train, X_val, y_val) -> LGBMClassifier:
    model = LGBMClassifier(
        n_estimators=500,
        learning_rate=0.05,
        num_leaves=63,
        n_jobs=-1,
        random_state=RANDOM_STATE,
        verbose=-1,
    )
    model.fit(
        X_train,
        y_train,
        eval_set=[(X_val, y_val)],
        callbacks=[
            lgb.early_stopping(stopping_rounds=50, verbose=False),
            lgb.log_evaluation(period=50),
        ],
    )
    return model


def evaluate(model: LGBMClassifier, X, y) -> dict:
    y_pred = model.predict(X)
    y_prob = model.predict_proba(X)[:, 1]
    return {
        "accuracy": float(accuracy_score(y, y_pred)),
        "auc_roc": float(roc_auc_score(y, y_prob)),
        "f1_score": float(f1_score(y, y_pred)),
        "classification_report": classification_report(y, y_pred),
    }


def main() -> None:
    import gc

    print(f"Loading dataset from {DATASET_PATH}")
    df = load_dataset()

    drug_embs, disease_embs, embedding_dim = generate_embeddings(df)
    X = build_feature_matrix(drug_embs, disease_embs)
    y = df["label"].values

    del drug_embs, disease_embs, df
    gc.collect()
    print("RAM freed after embedding")

    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )

    del X
    gc.collect()
    print("RAM freed after first split")

    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=VAL_SIZE, random_state=RANDOM_STATE, stratify=y_temp
    )

    del X_temp, y_temp
    gc.collect()
    print("RAM freed after second split")

    print(
        f"Train: {X_train.shape[0]}, "
        f"Val: {X_val.shape[0]}, Test: {X_test.shape[0]}"
    )

    start = time.perf_counter()
    model = train_model(X_train, y_train, X_val, y_val)
    training_time = time.perf_counter() - start
    print(f"Training time: {training_time:.2f} seconds")

    val_metrics = evaluate(model, X_val, y_val)
    test_metrics = evaluate(model, X_test, y_test)

    print("\nValidation metrics")
    print(f"  Accuracy:  {val_metrics['accuracy']:.4f}")
    print(f"  AUC-ROC:   {val_metrics['auc_roc']:.4f}")
    print(f"  F1-score:  {val_metrics['f1_score']:.4f}")

    print("\nTest metrics")
    print(f"  Accuracy:  {test_metrics['accuracy']:.4f}")
    print(f"  AUC-ROC:   {test_metrics['auc_roc']:.4f}")
    print(f"  F1-score:  {test_metrics['f1_score']:.4f}")
    print("\nClassification report:")
    print(test_metrics["classification_report"])

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, ARTIFACTS_DIR / "biobert_lgbm_model.pkl")

    metrics_to_save = {
        "validation": {
            "accuracy": val_metrics["accuracy"],
            "auc_roc": val_metrics["auc_roc"],
            "f1_score": val_metrics["f1_score"],
        },
        "test": {
            "accuracy": test_metrics["accuracy"],
            "auc_roc": test_metrics["auc_roc"],
            "f1_score": test_metrics["f1_score"],
        },
    }
    with open(ARTIFACTS_DIR / "biobert_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics_to_save, f, indent=2)

    config_to_save = {
        "embedding_model": EMBEDDING_MODEL,
        "embedding_dim": int(embedding_dim),
        "feature_dim": 1536,
    }
    with open(ARTIFACTS_DIR / "biobert_config.json", "w", encoding="utf-8") as f:
        json.dump(config_to_save, f, indent=2)

    tfidf_metrics_path = Path("ml/artifacts/lightgbm/lightgbm_metrics.json")
    if tfidf_metrics_path.exists():
        with open(tfidf_metrics_path, "r", encoding="utf-8") as f:
            tfidf_metrics = json.load(f)

        print("\nModel comparison")
        print("Model           | Accuracy | AUC-ROC | F1")
        print(
            "TF-IDF LightGBM | "
            f"{tfidf_metrics['test']['accuracy']:.4f}   | "
            f"{tfidf_metrics['test']['auc_roc']:.4f}  | "
            f"{tfidf_metrics['test']['f1_score']:.4f}"
        )
        print(
            "BioBERT LightGBM| "
            f"{test_metrics['accuracy']:.4f}   | "
            f"{test_metrics['auc_roc']:.4f}  | "
            f"{test_metrics['f1_score']:.4f}"
        )


if __name__ == "__main__":
    main()

