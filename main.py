import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.core.database import engine, Base
from app.core.config import settings
from app.api.routes import drugs, diseases, predict, interactions, auth, admin, oauth


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Drug-Disease Association System",
    description="Dự đoán liên kết Thuốc - Bệnh dựa trên Machine Learning",
    version="1.0.0"
)

app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(drugs.router)
app.include_router(diseases.router)
app.include_router(predict.router)
app.include_router(interactions.router)
app.include_router(oauth.router)

@app.get("/", tags=["Health Check"])
def root():
    return {"message": "DDA System is running", "docs": "/docs", "version": "1.0.0"}