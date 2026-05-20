"""Load and evaluate trained DDA models (LightGBM, XGBoost, MLP) and generate a comparison report."""

import os
import json
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from scipy.sparse import hstack
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
import warnings
warnings.filterwarnings("ignore")

# evaluate_models.py
LIGHTGBM_DIR = Path("ml/artifacts/lightgbm")
XGBOOST_DIR  = Path("ml/artifacts/xgboost")
MLP_DIR      = Path("ml/artifacts/mlp")
DATASET_PATH = Path("data/processed/dda_dataset.csv")
REPORTS_DIR = Path("ml/reports")

RANDOM_STATE = 42
TEST_SIZE = 0.2
INPUT_DIM = 1000


class DDAClassifier(nn.Module):
    def __init__(self, input_dim: int = INPUT_DIM):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATASET_PATH)
    df = df.dropna(subset=["drug_name", "disease_name", "label"])
    df["drug_name"] = df["drug_name"].astype(str)
    df["disease_name"] = df["disease_name"].astype(str)
    return df


def load_test_split(df: pd.DataFrame) -> pd.DataFrame:
    # Bước 1: tách test 15%
    _, test_df = train_test_split(
        df,
        test_size=0.15,
        random_state=RANDOM_STATE,
        stratify=df["label"],
    )
    return test_df

def compute_metrics(y_true: np.ndarray, y_pred: np.ndarray, y_prob: np.ndarray) -> dict:
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "auc_roc": float(roc_auc_score(y_true, y_prob)),
        "f1_score": float(f1_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred)),
        "recall": float(recall_score(y_true, y_pred)),
    }


def transform_sparse(test_df: pd.DataFrame, drug_vectorizer, disease_vectorizer):
    drug_features = drug_vectorizer.transform(test_df["drug_name"])
    disease_features = disease_vectorizer.transform(test_df["disease_name"])
    return hstack([drug_features, disease_features])


def evaluate_lightgbm(test_df: pd.DataFrame, y_test: np.ndarray) -> dict | None:
    model_path = LIGHTGBM_DIR / "lightgbm_model.pkl"
    drug_tfidf_path = LIGHTGBM_DIR / "drug_tfidf.pkl"
    disease_tfidf_path = LIGHTGBM_DIR / "disease_tfidf.pkl"

    if not model_path.exists():
        warnings.warn(f"LightGBM model not found at {model_path}, skipping.")
        return None

    model = joblib.load(model_path)
    drug_vectorizer = joblib.load(drug_tfidf_path)
    disease_vectorizer = joblib.load(disease_tfidf_path)

    X_test = transform_sparse(test_df, drug_vectorizer, disease_vectorizer)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    return compute_metrics(y_test, y_pred, y_prob)


def evaluate_xgboost(test_df: pd.DataFrame, y_test: np.ndarray) -> dict | None:
    model_path = XGBOOST_DIR / "xgboost_model.pkl"
    drug_tfidf_path = XGBOOST_DIR / "xgboost_drug_tfidf.pkl"
    disease_tfidf_path = XGBOOST_DIR / "xgboost_disease_tfidf.pkl"

    if not model_path.exists():
        warnings.warn(f"XGBoost model not found at {model_path}, skipping.")
        return None

    model = joblib.load(model_path)
    drug_vectorizer = joblib.load(drug_tfidf_path)
    disease_vectorizer = joblib.load(disease_tfidf_path)

    X_test = transform_sparse(test_df, drug_vectorizer, disease_vectorizer)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    return compute_metrics(y_test, y_pred, y_prob)


def evaluate_mlp(test_df: pd.DataFrame, y_test: np.ndarray) -> dict | None:
    model_path   = MLP_DIR / "mlp_model.pth"
    drug_path    = MLP_DIR / "mlp_drug_tfidf.pkl"
    disease_path = MLP_DIR / "mlp_disease_tfidf.pkl"
    scaler_path  = MLP_DIR / "mlp_scaler.pkl"
    arch_path    = MLP_DIR / "mlp_architecture.json"

    for p in [model_path, drug_path, disease_path, scaler_path]:
        if not p.exists():
            warnings.warn(f"MLP file not found: {p}, skipping.")
            return None

    drug_vectorizer    = joblib.load(drug_path)
    disease_vectorizer = joblib.load(disease_path)
    scaler             = joblib.load(scaler_path)

    input_dim = INPUT_DIM
    if arch_path.exists():
        with open(arch_path, encoding="utf-8") as f:
            architecture = json.load(f)
        input_dim = architecture.get("input_features", INPUT_DIM)

    sparse_features = transform_sparse(test_df, drug_vectorizer, disease_vectorizer)
    dense_features  = scaler.transform(sparse_features.toarray())

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model  = DDAClassifier(input_dim=input_dim).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    X_tensor = torch.FloatTensor(dense_features).to(device)
    with torch.no_grad():
        y_prob = model(X_tensor).cpu().numpy().flatten()

    y_pred = (y_prob >= 0.5).astype(int)
    return compute_metrics(y_test, y_pred, y_prob)


def print_comparison_table(results: dict[str, dict], missing_models: list[str]) -> str | None:
    model_order = ["LightGBM", "XGBoost", "MLP"]
    key_map = {"LightGBM": "lightgbm", "XGBoost": "xgboost", "MLP": "mlp"}

    available = [name for name in model_order if key_map[name] in results]

    print()
    print("╔══════════════════════════════════════════════════════════╗")
    print("║              MODEL COMPARISON REPORT                    ║")
    print("╠══════════╦═══════════╦═══════════╦══════════╦══════════╣")
    print("║  Model   ║ Accuracy  ║  AUC-ROC  ║    F1    ║  Recall  ║")
    print("╠══════════╬═══════════╬═══════════╬══════════╬══════════╣")

    best_name = None
    best_auc = -1.0

    for display_name in model_order:
        key = key_map[display_name]
        if key not in results:
            print(f"║ {display_name:<8} ║    N/A    ║    N/A    ║   N/A    ║   N/A    ║")
            continue

        metrics = results[key]
        print(
            f"║ {display_name:<8} ║"
            f"   {metrics['accuracy']:.4f}  ║"
            f"   {metrics['auc_roc']:.4f}  ║"
            f"  {metrics['f1_score']:.4f}  ║"
            f"  {metrics['recall']:.4f}  ║"
        )
        if metrics["auc_roc"] > best_auc:
            best_auc = metrics["auc_roc"]
            best_name = display_name

    print("╚══════════╩═══════════╩═══════════╩══════════╩══════════╝")

    if best_name:
        print(f"Best model by AUC-ROC: {best_name}")
    else:
        print("Best model by AUC-ROC: N/A (no models evaluated)")

    if missing_models:
        print(f"\nMissing models (not evaluated): {', '.join(missing_models)}")

    return best_name


def main() -> None:
    os.chdir(Path(__file__).parent.parent)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Loading dataset from {DATASET_PATH}")
    df = load_dataset()
    test_df = load_test_split(df)
    y_test = test_df["label"].values

    print(f"  Total samples: {len(df)}")
    print(f"  Test samples: {len(test_df)}")

    results: dict[str, dict] = {}
    missing_models: list[str] = []

    print("\nEvaluating LightGBM...")
    lightgbm_metrics = evaluate_lightgbm(test_df, y_test)
    if lightgbm_metrics:
        results["lightgbm"] = lightgbm_metrics
        print(f"  AUC-ROC: {lightgbm_metrics['auc_roc']:.4f}")
    else:
        missing_models.append("LightGBM")

    print("\nEvaluating XGBoost...")
    xgboost_metrics = evaluate_xgboost(test_df, y_test)
    if xgboost_metrics:
        results["xgboost"] = xgboost_metrics
        print(f"  AUC-ROC: {xgboost_metrics['auc_roc']:.4f}")
    else:
        missing_models.append("XGBoost")

    print("\nEvaluating MLP...")
    mlp_metrics = evaluate_mlp(test_df, y_test)
    if mlp_metrics:
        results["mlp"] = mlp_metrics
        print(f"  AUC-ROC: {mlp_metrics['auc_roc']:.4f}")
    else:
        missing_models.append("MLP")

    best_model = print_comparison_table(results, missing_models)

    comparison = {
        "models": results,
        "best_model_by_auc_roc": best_model,
        "missing_models": missing_models,
        "test_samples": int(len(test_df)),
    }

    report_path = REPORTS_DIR / "model_comparison.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(comparison, f, indent=2)

    print(f"\nComparison report saved to {report_path}")


if __name__ == "__main__":
    main()
