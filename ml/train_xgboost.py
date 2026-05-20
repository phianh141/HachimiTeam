"""Train an XGBoost binary classifier on TF-IDF features from drug and disease names."""

import json
import time
from pathlib import Path

import joblib
import pandas as pd
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import os 
os.chdir(Path(__file__).parent.parent)

DATASET_PATH = Path("data/processed/dda_dataset.csv")
ARTIFACTS_DIR = Path("ml/artifacts")

RANDOM_STATE = 42
TEST_SIZE = 0.2
MAX_FEATURES = 500


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATASET_PATH)
    required = ["drug_id", "drug_name", "disease_id", "disease_name", "label"]
    missing_cols = [col for col in required if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset missing columns: {missing_cols}")

    df = df.dropna(subset=["drug_name", "disease_name", "label"])
    df["drug_name"] = df["drug_name"].astype(str)
    df["disease_name"] = df["disease_name"].astype(str)
    return df


def build_features(df: pd.DataFrame):
    drug_vectorizer = TfidfVectorizer(max_features=MAX_FEATURES)
    disease_vectorizer = TfidfVectorizer(max_features=MAX_FEATURES)

    drug_features = drug_vectorizer.fit_transform(df["drug_name"])
    disease_features = disease_vectorizer.fit_transform(df["disease_name"])
    
    # Convert sang dense 
    features = hstack([drug_features, disease_features]).toarray()

    y = df["label"].values
    return features, y, drug_vectorizer, disease_vectorizer


def train_model(X_train, y_train) -> XGBClassifier:
    model = XGBClassifier(
        tree_method="hist",
        device="cuda",
        n_estimators=500,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=RANDOM_STATE,
        eval_metric="auc",
    )
    model.fit(X_train, y_train)
    return model


def evaluate(model: XGBClassifier, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "auc_roc": float(roc_auc_score(y_test, y_prob)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
        "y_pred": y_pred,
    }


def save_artifacts(
    model: XGBClassifier,
    drug_vectorizer: TfidfVectorizer,
    disease_vectorizer: TfidfVectorizer,
    metrics: dict,
) -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, ARTIFACTS_DIR / "xgboost_model.pkl")
    joblib.dump(drug_vectorizer, ARTIFACTS_DIR / "xgboost_drug_tfidf.pkl")
    joblib.dump(disease_vectorizer, ARTIFACTS_DIR / "xgboost_disease_tfidf.pkl")

    metrics_to_save = {
        "accuracy": metrics["accuracy"],
        "auc_roc": metrics["auc_roc"],
        "f1_score": metrics["f1_score"],
        "classification_report": metrics["classification_report"],
    }
    with open(ARTIFACTS_DIR / "xgboost_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics_to_save, f, indent=2)


def main() -> None:
    print(f"Loading dataset from {DATASET_PATH}")
    df = load_dataset()
    print(f"  Samples: {len(df)}")
    print(f"  Features per sample (expected): {MAX_FEATURES * 2}")

    features, y, drug_vectorizer, disease_vectorizer = build_features(df)
    print(f"  Feature matrix shape: {features.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        features,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y,
    )
    print(f"  Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")

    start = time.perf_counter()
    model = train_model(X_train, y_train)
    training_time = time.perf_counter() - start
    print(f"\nTraining time: {training_time:.2f} seconds")

    metrics = evaluate(model, X_test, y_test)

    print("\nTest set metrics")
    print(f"  Accuracy:  {metrics['accuracy']:.4f}")
    print(f"  AUC-ROC:   {metrics['auc_roc']:.4f}")
    print(f"  F1-score:  {metrics['f1_score']:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, metrics["y_pred"]))

    save_artifacts(model, drug_vectorizer, disease_vectorizer, metrics)
    print(f"\nArtifacts saved to {ARTIFACTS_DIR}/")


if __name__ == "__main__":
    main()
