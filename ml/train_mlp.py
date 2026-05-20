"""Train a PyTorch MLP binary classifier on TF-IDF features (Kaggle T4 GPU)."""

import json
import time
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from torch.utils.data import DataLoader, Dataset
os.chdir(Path(__file__).parent.parent)

DATASET_PATH = Path("/kaggle/input/dda-dataset/dda_dataset.csv")
ARTIFACTS_DIR = Path("/kaggle/working")

RANDOM_STATE = 42
TEST_SIZE = 0.2
MAX_FEATURES = 500
INPUT_DIM = 1000
EPOCHS = 50
BATCH_SIZE = 1024
LEARNING_RATE = 0.001


class DDADataset(Dataset):
    def __init__(self, X: np.ndarray, y: np.ndarray):
        self.X = X
        self.y = y

    def __len__(self) -> int:
        return len(self.y)

    def __getitem__(self, idx: int):
        return torch.FloatTensor(self.X[idx]), torch.FloatTensor([self.y[idx]])


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
    sparse_features = hstack([drug_features, disease_features])
    dense_features = sparse_features.toarray()

    scaler = StandardScaler()
    features = scaler.fit_transform(dense_features)
    y = df["label"].values.astype(np.float32)

    return features, y, drug_vectorizer, disease_vectorizer, scaler


def train_epoch(
    model: DDAClassifier,
    loader: DataLoader,
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    device: torch.device,
) -> float:
    model.train()
    total_loss = 0.0
    n_batches = 0

    for X_batch, y_batch in loader:
        X_batch = X_batch.to(device)
        y_batch = y_batch.to(device)

        optimizer.zero_grad()
        outputs = model(X_batch)
        loss = criterion(outputs, y_batch)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        n_batches += 1

    return total_loss / n_batches


def predict_proba(model: DDAClassifier, X: np.ndarray, device: torch.device) -> np.ndarray:
    model.eval()
    dataset = DDADataset(X, np.zeros(len(X), dtype=np.float32))
    loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=False)

    probs: list[np.ndarray] = []
    with torch.no_grad():
        for X_batch, _ in loader:
            X_batch = X_batch.to(device)
            outputs = model(X_batch).cpu().numpy().flatten()
            probs.append(outputs)

    return np.concatenate(probs)


def evaluate(model: DDAClassifier, X_test: np.ndarray, y_test: np.ndarray, device: torch.device) -> dict:
    y_prob = predict_proba(model, X_test, device)
    y_pred = (y_prob >= 0.5).astype(int)

    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "auc_roc": float(roc_auc_score(y_test, y_prob)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
        "y_pred": y_pred,
    }


def get_architecture_info() -> dict:
    return {
        "input_features": INPUT_DIM,
        "layers": [
            {"type": "Linear", "in_features": INPUT_DIM, "out_features": 512},
            {"type": "ReLU"},
            {"type": "Dropout", "p": 0.3},
            {"type": "Linear", "in_features": 512, "out_features": 256},
            {"type": "ReLU"},
            {"type": "Dropout", "p": 0.3},
            {"type": "Linear", "in_features": 256, "out_features": 128},
            {"type": "ReLU"},
            {"type": "Dropout", "p": 0.2},
            {"type": "Linear", "in_features": 128, "out_features": 1},
            {"type": "Sigmoid"},
        ],
        "optimizer": "Adam",
        "learning_rate": LEARNING_RATE,
        "loss": "BCELoss",
        "epochs": EPOCHS,
        "batch_size": BATCH_SIZE,
    }


def save_artifacts(
    model: DDAClassifier,
    drug_vectorizer: TfidfVectorizer,
    disease_vectorizer: TfidfVectorizer,
    scaler: StandardScaler,
    metrics: dict,
) -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    torch.save(model.state_dict(), ARTIFACTS_DIR / "mlp_model.pth")
    joblib.dump(drug_vectorizer, ARTIFACTS_DIR / "mlp_drug_tfidf.pkl")
    joblib.dump(disease_vectorizer, ARTIFACTS_DIR / "mlp_disease_tfidf.pkl")
    joblib.dump(scaler, ARTIFACTS_DIR / "mlp_scaler.pkl")

    metrics_to_save = {
        "accuracy": metrics["accuracy"],
        "auc_roc": metrics["auc_roc"],
        "f1_score": metrics["f1_score"],
        "classification_report": metrics["classification_report"],
    }
    with open(ARTIFACTS_DIR / "mlp_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics_to_save, f, indent=2)

    with open(ARTIFACTS_DIR / "mlp_architecture.json", "w", encoding="utf-8") as f:
        json.dump(get_architecture_info(), f, indent=2)


def main() -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    print(f"Loading dataset from {DATASET_PATH}")
    df = load_dataset()
    print(f"  Samples: {len(df)}")

    features, y, drug_vectorizer, disease_vectorizer, scaler = build_features(df)
    print(f"  Feature matrix shape: {features.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        features,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y,
    )
    print(f"  Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")

    train_loader = DataLoader(
        DDADataset(X_train, y_train),
        batch_size=BATCH_SIZE,
        shuffle=True,
    )

    model = DDAClassifier(input_dim=INPUT_DIM).to(device)
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

    total_start = time.perf_counter()
    epoch_times: list[float] = []

    for epoch in range(EPOCHS):
        epoch_start = time.perf_counter()
        avg_loss = train_epoch(model, train_loader, criterion, optimizer, device)
        epoch_time = time.perf_counter() - epoch_start
        epoch_times.append(epoch_time)

        print(f"Epoch {epoch + 1}/{EPOCHS} - time: {epoch_time:.2f}s")
        if (epoch + 1) % 10 == 0:
            print(f"  Loss: {avg_loss:.4f}")

    total_time = time.perf_counter() - total_start
    print(f"\nTotal training time: {total_time:.2f}s")
    print(f"Average time per epoch: {np.mean(epoch_times):.2f}s")

    metrics = evaluate(model, X_test, y_test, device)

    print("\nTest set metrics")
    print(f"  Accuracy:  {metrics['accuracy']:.4f}")
    print(f"  AUC-ROC:   {metrics['auc_roc']:.4f}")
    print(f"  F1-score:  {metrics['f1_score']:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, metrics["y_pred"]))

    save_artifacts(model, drug_vectorizer, disease_vectorizer, scaler, metrics)
    print(f"\nArtifacts saved to {ARTIFACTS_DIR}/")


if __name__ == "__main__":
    main()
