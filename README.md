# DDA Backend — Drug-Disease Association System

Hệ thống dự đoán liên kết Thuốc-Bệnh dựa trên Machine Learning, hỗ trợ bài toán Tái mục đích thuốc (Drug Repurposing).

---

## Yêu cầu hệ thống

- Python 3.12+
- Docker Desktop
- Git

---

## Hướng dẫn cài đặt

### Bước 1 — Cài Docker Desktop

Tải và cài đặt tại: https://www.docker.com/products/docker-desktop

Sau khi cài xong, mở Docker Desktop và đảm bảo nó đang chạy (icon ở taskbar).

### Bước 2 — Clone repo và cấu hình môi trường

```bash
git clone <repo-url>
cd dda-backend
```

Mở file `.env_sample`, đổi tên thành `.env`, chỉnh sửa nếu cần:

```env
DATABASE_URL=postgresql://dda_user:dda_pass@localhost:5432/dda_db
APP_NAME=DDA System
DEBUG=True
SECRET_KEY=dda_super_secret_key_change_this_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Mặc định không cần chỉnh gì nếu chạy local.

### Bước 3 — Chạy file setup

```bash
setup.bat
```

Script này sẽ tự động:
- Kiểm tra Python và Docker
- Tạo virtual environment và cài thư viện
- Tạo container PostgreSQL
- Hỏi có muốn import data vào DB không (chỉ làm **1 lần duy nhất**)

### Bước 4 — Khởi động server

```bash
# Kích hoạt venv (nếu chưa active)
venv\Scripts\Activate.ps1

# Chạy server
uvicorn main:app --reload
```

### Bước 5 — Kiểm tra

Mở trình duyệt vào: http://localhost:8000/docs

Thấy Swagger UI là server đang chạy bình thường.

---

## Workflow mỗi lần làm việc

```
1. Mở Docker Desktop
2. Kiểm tra container: docker ps
   Nếu không thấy dda-postgres: docker start dda-postgres
3. Kích hoạt venv: venv\Scripts\Activate.ps1
4. Chạy server: uvicorn main:app --reload
5. Mở http://localhost:8000/docs
```

---

## Cấu trúc dự án

```
dda-backend/
├── app/
│   ├── api/routes/
│   │   ├── auth.py          ← Đăng ký, đăng nhập, lịch sử
│   │   ├── admin.py         ← Quản lý người dùng (admin only)
│   │   ├── drugs.py         ← CRUD thuốc
│   │   ├── diseases.py      ← CRUD bệnh
│   │   ├── predict.py       ← F1, F2 dự đoán
│   │   └── interactions.py  ← F3 tương tác thuốc
│   ├── core/
│   │   ├── config.py        ← Cấu hình từ .env
│   │   ├── database.py      ← Kết nối PostgreSQL
│   │   ├── security.py      ← JWT, bcrypt
│   │   └── deps.py          ← Dependencies (auth guard)
│   ├── models/models.py     ← Database models (7 bảng)
│   └── schemas/schemas.py   ← Request/Response schemas
├── ml/
│   ├── train_lightgbm.py    ← Train LightGBM
│   ├── train_xgboost.py     ← Train XGBoost
│   ├── train_mlp.py         ← Train MLP (Kaggle)
│   ├── evaluate_models.py   ← So sánh 3 models
│   ├── predictor.py         ← Load model và predict
│   └── artifacts/           ← Model files (.pkl, .pth)
├── data/
│   ├── seed_biosnap.py      ← Import thuốc và bệnh vào DB
│   ├── seed_ddi.py          ← Import tương tác thuốc vào DB
│   ├── mapping_biosnap.py   ← Map DrugBank/MeSH ID → tên
│   ├── process_biosnap.py   ← Xử lý dataset cho ML
│   └── raw/                 ← Dataset gốc (không commit)
├── main.py                  ← Entry point
├── .env                     ← Biến môi trường (không commit)
├── .env_sample              ← Template .env
├── requirements.txt
└── setup.bat
```

---

## Database

7 bảng trong PostgreSQL:

| Bảng | Mô tả | Số lượng |
|---|---|---|
| `drugs` | Danh mục thuốc từ DrugBank/BioSNAP | ~1,654 |
| `diseases` | Danh mục bệnh từ CTD/NIH | ~13,391 |
| `drug_disease_labels` | Ground truth từ BioSNAP (label 0/1) | ~930k |
| `prediction_scores` | Cache kết quả ML (tăng tốc F1/F2) | tăng dần |
| `drug_interactions` | Tương tác thuốc từ TWOSIDES | ~104,316 |
| `users` | Tài khoản người dùng | — |
| `prediction_history` | Lịch sử dự đoán theo user | tăng dần |

---

## ML Models

3 model đã train, lưu tại `ml/artifacts/`:

| Model | AUC-ROC | F1 | Thư mục |
|---|---|---|---|
| MLP (PyTorch) | **0.9058** | 0.8288 | `ml/artifacts/mlp/` |
| LightGBM | 0.8999 | 0.8174 | `ml/artifacts/lightgbm/` |
| XGBoost | 0.8335 | 0.7360 | `ml/artifacts/xgboost/` |

Model mặc định dùng trong API: **LightGBM** (cân bằng tốt giữa tốc độ và độ chính xác).

---

## API Reference

### Authentication

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản | Không |
| POST | `/auth/login` | Đăng nhập, nhận JWT token | Không |
| GET | `/auth/me` | Xem thông tin user hiện tại | Cần token |
| PUT | `/auth/change-password` | Đổi mật khẩu | Cần token |
| GET | `/auth/history` | Xem lịch sử dự đoán | Cần token |
| DELETE | `/auth/history/{id}` | Xóa một record lịch sử | Cần token |

### F1 — Dự đoán cặp thuốc-bệnh

```
POST /predict/single
```

**Request:**
```json
{
  "drug_id": 1,
  "disease_id": 1
}
```

**Response:**
```json
{
  "drug_id": 1,
  "disease_id": 1,
  "drug_name": "Aspirin",
  "disease_name": "Type 2 Diabetes",
  "score": 0.2537,
  "confidence": "Low"
}
```

**Confidence levels:**
- `High` — score ≥ 0.7
- `Medium` — 0.4 ≤ score < 0.7
- `Low` — score < 0.4

**Luồng Frontend:**
1. Gọi `GET /drugs/search?name=<tên thuốc>` để lấy `drug_id`
2. Gọi `GET /diseases/search?name=<tên bệnh>` để lấy `disease_id`
3. Gọi `POST /predict/single` với 2 ID trên

---

### F2 — Top 5 thuốc liên kết cao nhất với bệnh

```
GET /predict/top5/{disease_id}
```

**Response:**
```json
{
  "disease_id": 1,
  "disease_name": "Type 2 Diabetes",
  "top_drugs": [
    {
      "drug_id": 8,
      "drug_name": "Simvastatin",
      "score": 0.6977,
      "confidence": "Medium"
    }
  ]
}
```

**Luồng Frontend:**
1. Gọi `GET /diseases/search?name=<tên bệnh>` để lấy `disease_id`
2. Gọi `GET /predict/top5/{disease_id}`

---

### F3 — Kiểm tra tương tác thuốc

```
POST /interactions/check
```

**Request:**
```json
{
  "drug_names": ["Aspirin", "Warfarin", "Metformin"]
}
```

**Response:**
```json
{
  "total_drugs": 3,
  "total_pairs_checked": 3,
  "interactions_found": 1,
  "interactions": [
    {
      "drug_a": "Aspirin",
      "drug_b": "Warfarin",
      "description": "Aspirin may increase the anticoagulant activities of Warfarin.",
      "source": "TWOSIDES"
    }
  ]
}
```

**Giới hạn:** Tối đa 10 thuốc mỗi lần kiểm tra.

---

### Drugs & Diseases (CRUD + Search)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/drugs/` | Danh sách thuốc (có phân trang) |
| GET | `/drugs/search?name=<tên>` | Tìm kiếm thuốc theo tên |
| GET | `/drugs/{drug_id}` | Lấy thông tin 1 thuốc |
| POST | `/drugs/` | Tạo thuốc mới |
| PUT | `/drugs/{drug_id}` | Cập nhật thuốc |
| DELETE | `/drugs/{drug_id}` | Xóa thuốc |
| GET | `/diseases/` | Danh sách bệnh |
| GET | `/diseases/search?name=<tên>` | Tìm kiếm bệnh theo tên |
| GET | `/diseases/{disease_id}` | Lấy thông tin 1 bệnh |

### Admin (Cần role admin)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/admin/users` | Danh sách tất cả users |
| GET | `/admin/users/{id}` | Thông tin 1 user |
| PATCH | `/admin/users/{id}/role` | Đổi role (user/admin) |
| PATCH | `/admin/users/{id}/status` | Kích hoạt/vô hiệu hóa |
| DELETE | `/admin/users/{id}` | Xóa user |
| GET | `/admin/stats` | Thống kê hệ thống |

---

## Hướng dẫn cho Frontend 

### Luồng autocomplete tên thuốc/bệnh

```
User gõ tên → GET /drugs/search?name=xxx → hiện dropdown
User chọn  → Frontend giữ drug_id
Bấm Predict → POST /predict/single với {drug_id, disease_id}
```

### Luồng Authentication

```
1. POST /auth/register → tạo tài khoản
2. POST /auth/login → nhận access_token
3. Lưu token vào localStorage
4. Mọi request cần auth → thêm header: Authorization:  <token>
> Để sử dụng các chức năng của Admin thì nhớ cop token và dán vào Authorization 
5. GET /auth/me → lấy thông tin user hiện tại
```

### Phân quyền

```
Guest  → chỉ xem trang giới thiệu, đăng ký, đăng nhập
User   → dùng F1, F2, F3, xem lịch sử
Admin  → tất cả quyền User + /admin/* routes
```

---

## Tài khoản test
## Chạy lệnh này để tạo acc admin
python -c "
import sys
sys.path.append('.')
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.models import User

db = SessionLocal()
admin = User(
    username='superadmin',
    email='admin@dda.com',
    password=hash_password('admin123'),
    role='admin',
    is_active=1
)
db.add(admin)
db.commit()
print('Admin created!')
db.close()
"

> Tạo tài khoản user thường qua `POST /auth/register`


---

## Liên hệ
