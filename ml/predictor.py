"""Load trained DDA models and provide prediction functions for the FastAPI backend."""

from pathlib import Path

import joblib
import torch
import torch.nn as nn
from scipy.sparse import hstack
import os

ARTIFACTS_DIR = Path("ml/artifacts")
DEFAULT_MODEL = "lightgbm"
INPUT_DIM = 1000

_predictor: "DDAPredictor | None" = None
_predictor_type: str | None = None


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


class DDAPredictor:
    def __init__(self, model_type: str = DEFAULT_MODEL):
        if model_type not in ("lightgbm", "xgboost", "mlp"):
            raise ValueError(f"Unsupported model_type: {model_type}")

        self.model_type = model_type
        self.model = None
        self.drug_vectorizer = None
        self.disease_vectorizer = None
        self.scaler = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        if model_type == "lightgbm":
            self._load_lightgbm()
        elif model_type == "xgboost":
            self._load_xgboost()
        else:
            self._load_mlp()

        print(f"Loaded {model_type} model from {ARTIFACTS_DIR}")

    def _load_lightgbm(self) -> None:
        self.model = joblib.load(ARTIFACTS_DIR / "lightgbm_model.pkl")
        self.drug_vectorizer = joblib.load(ARTIFACTS_DIR / "drug_tfidf.pkl")
        self.disease_vectorizer = joblib.load(ARTIFACTS_DIR / "disease_tfidf.pkl")

    def _load_xgboost(self) -> None:
        self.model = joblib.load(ARTIFACTS_DIR / "xgboost_model.pkl")
        self.drug_vectorizer = joblib.load(ARTIFACTS_DIR / "xgboost_drug_tfidf.pkl")
        self.disease_vectorizer = joblib.load(ARTIFACTS_DIR / "xgboost_disease_tfidf.pkl")

    def _load_mlp(self) -> None:
        self.drug_vectorizer = joblib.load(ARTIFACTS_DIR / "mlp_drug_tfidf.pkl")
        self.disease_vectorizer = joblib.load(ARTIFACTS_DIR / "mlp_disease_tfidf.pkl")
        self.scaler = joblib.load(ARTIFACTS_DIR / "mlp_scaler.pkl")

        model = DDAClassifier(input_dim=INPUT_DIM)
        model.load_state_dict(
            torch.load(ARTIFACTS_DIR / "mlp_model.pth", map_location=self.device)
        )
        model.to(self.device)
        model.eval()
        self.model = model

    def _build_features(self, drug_names: list[str], disease_names: list[str]):
        drug_features = self.drug_vectorizer.transform(drug_names)
        disease_features = self.disease_vectorizer.transform(disease_names)
        sparse_features = hstack([drug_features, disease_features])

        if self.model_type == "mlp":
            dense_features = sparse_features.toarray()
            return self.scaler.transform(dense_features)

        return sparse_features

    def predict_single(self, drug_name: str, disease_name: str) -> float:
        features = self._build_features([drug_name], [disease_name])

        if self.model_type == "mlp":
            with torch.no_grad():
                X = torch.FloatTensor(features).to(self.device)
                return float(self.model(X).cpu().numpy().flatten()[0])

        return float(self.model.predict_proba(features)[0, 1])

    def predict_batch(self, drug_names: list[str], disease_name: str) -> list[float]:
        disease_names = [disease_name] * len(drug_names)
        features = self._build_features(drug_names, disease_names)

        if self.model_type == "mlp":
            with torch.no_grad():
                X = torch.FloatTensor(features).to(self.device)
                probs = self.model(X).cpu().numpy().flatten()
            return [float(p) for p in probs]

        probs = self.model.predict_proba(features)[:, 1]
        return [float(p) for p in probs]


def get_predictor(model_type: str = DEFAULT_MODEL) -> DDAPredictor:
    global _predictor, _predictor_type

    if _predictor is None or _predictor_type != model_type:
        _predictor = DDAPredictor(model_type)
        _predictor_type = model_type

    return _predictor


if __name__ == "__main__":
    os.chdir(Path(__file__).parent.parent)
    pred = get_predictor("lightgbm")
    score = pred.predict_single("Aspirin", "Hypertension")
    print(f"Aspirin → Hypertension: {score:.4f}")
