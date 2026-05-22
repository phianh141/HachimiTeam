from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.routes import drugs, diseases, predict, interactions

 

# Tự động tạo tables nếu chưa có
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Drug-Disease Association System",
    description="Dự đoán liên kết Thuốc - Bệnh dựa trên Machine Learning",
    version="1.0.0"
)

# Cấu hình CORS — cho phép Frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React Vite
        "http://localhost:3000",  # React CRA
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gắn các routes vào app
app.include_router(drugs.router)
app.include_router(diseases.router)
app.include_router(predict.router)


@app.get("/", tags=["Health Check"])
def root():
    return {
        "message": "DDA System is running",
        "docs": "/docs",
        "version": "1.0.0"
    }

app.include_router(interactions.router)