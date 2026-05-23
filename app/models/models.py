from sqlalchemy import Column, Integer, String, Float, SmallInteger, Text, TIMESTAMP, CheckConstraint, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base


class Drug(Base):
    __tablename__ = "drugs"

    drug_id     = Column(Integer, primary_key=True, index=True)
    drug_name   = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    created_at  = Column(TIMESTAMP, server_default=func.now())


class Disease(Base):
    __tablename__ = "diseases"

    disease_id   = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String(255), nullable=False, unique=True)
    description  = Column(Text)
    created_at   = Column(TIMESTAMP, server_default=func.now())


class DrugDiseaseLabel(Base):
    __tablename__ = "drug_disease_labels"

    id         = Column(Integer, primary_key=True, index=True)
    drug_id    = Column(Integer, nullable=False)
    disease_id = Column(Integer, nullable=False)
    label      = Column(SmallInteger, nullable=False)
    source     = Column(String(100))

    __table_args__ = (
        CheckConstraint("label IN (0, 1)", name="check_label_value"),
        UniqueConstraint("drug_id", "disease_id", "source", name="uq_drug_disease_source"),
    )


class PredictionScore(Base):
    __tablename__ = "prediction_scores"

    id            = Column(Integer, primary_key=True, index=True)
    drug_id       = Column(Integer, nullable=False)
    disease_id    = Column(Integer, nullable=False)
    score         = Column(Float, nullable=False)
    model_version = Column(String(50), default="v1.0")
    computed_at   = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("drug_id", "disease_id", "model_version", name="uq_score_per_model"),
    )


class DrugInteraction(Base):
    __tablename__ = "drug_interactions"

    id          = Column(Integer, primary_key=True, index=True)
    drug_a_id   = Column(Integer, nullable=False)
    drug_b_id   = Column(Integer, nullable=False)
    severity    = Column(String(20))
    description = Column(Text)
    source      = Column(String(100))

    __table_args__ = (
        CheckConstraint("drug_a_id < drug_b_id", name="check_drug_order"),
    )

class User(Base):
    __tablename__ = "users"

    user_id    = Column(Integer, primary_key=True, index=True)
    username   = Column(String(100), nullable=False, unique=True)
    email      = Column(String(255), nullable=False, unique=True)
    password   = Column(String(255), nullable=False)  # lưu hashed password
    role       = Column(String(20), default="user")   # "user" hoặc "admin"
    is_active  = Column(SmallInteger, default=1)
    created_at = Column(TIMESTAMP, server_default=func.now())


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, nullable=False)
    drug_id       = Column(Integer, nullable=False)
    disease_id    = Column(Integer, nullable=False)
    score         = Column(Float, nullable=False)
    model_version = Column(String(50), default="lightgbm-v1.0")
    created_at    = Column(TIMESTAMP, server_default=func.now())

## Check if the tables are created successfully
## python -c "from app.core.database import engine, Base; import app.models.models; Base.metadata.create_all(bind=engine);print('Tables created successfully!')"