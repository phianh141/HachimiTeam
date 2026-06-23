# DDA Backend — Drug-Disease Association System

Hệ thống dự đoán liên kết Thuốc-Bệnh dựa trên Machine Learning, hỗ trợ bài toán Tái mục đích thuốc (Drug Repurposing).

---

## Yêu cầu hệ thống

- **Python 3.12** (bắt buộc đúng phiên bản)
- **Docker Desktop** (đang chạy)
- Git

---

## Hướng dẫn cài đặt

### Bước 1 — Cài Docker Desktop

Tải và cài đặt tại: https://www.docker.com/products/docker-desktop

Mở Docker Desktop và đảm bảo icon ở taskbar đang chạy (không có dấu X).

### Bước 2 — Cài Python 3.12

> **Quan trọng:** Phải dùng đúng Python 3.12, không dùng 3.11 hay 3.13.

Tải tại: https://www.python.org/downloads/release/python-3120/

Khi cài đặt, tích chọn **"Add Python to PATH"**.

Kiểm tra sau khi cài:
```bash
py -3.12 --version
# Kết quả: Python 3.12.x
```

### Bước 3 — Clone repo

```bash
git clone <repo-url>
cd dda-backend
```

### Bước 4 — Chạy file setup

Double-click vào `setup.bat` hoặc chạy trong CMD:

```bash
setup.bat
```

Script sẽ tự động:
- Kiểm tra Python 3.12 và Docker
- Tạo virtual environment bằng Python 3.12
- Cài toàn bộ thư viện từ requirements.txt
- Tạo container PostgreSQL (port 5433)
- Tạo bảng database tự động
- Hỏi có muốn import data không (chỉ làm **1 lần duy nhất**)

> **Lưu ý port:** Dùng port 5433 thay vì 5432 để tránh conflict với PostgreSQL cài sẵn trên máy.

### Bước 5 — Chọn Python interpreter trong IDE

**VS Code / Cursor:**
1. `Ctrl + Shift + P`
2. Gõ `Python: Select Interpreter`
3. Chọn `.\venv\Scripts\python.exe`

Nếu không thấy → bấm **"Enter interpreter path"** → dán:
```
.\venv\Scripts\python.exe
```

### Bước 6 — Khởi động server

```bash
# Kích hoạt venv
venv\Scripts\Activate.ps1

# Chạy server
uvicorn main:app --reload
```

### Bước 7 — Kiểm tra

Mở trình duyệt: http://localhost:8000/docs

Thấy Swagger UI là server đang chạy bình thường.

---

## Workflow mỗi lần làm việc

```
1. Mở Docker Desktop
2. Kiểm tra container: docker ps
   → Nếu không thấy dda-postgres: docker start dda-postgres
3. Kích hoạt venv: venv\Scripts\Activate.ps1
4. Chạy server: uvicorn main:app --reload
5. Mở http://localhost:8000/docs
```

---

## Xử lý lỗi thường gặp

### Lỗi: "password authentication failed for user dda_user"

Máy đang có PostgreSQL cài sẵn ở port 5432 bị conflict. Kiểm tra file `.env`:

```env
DATABASE_URL=postgresql://dda_user:dda_pass@localhost:5433/dda_db
```

Đảm bảo port là **5433** không phải 5432.

### Lỗi: "Python 3.12 not found"

Chạy lệnh này để kiểm tra:
```bash
py -3.12 --version
```
Nếu báo lỗi → cài Python 3.12 tại link ở Bước 2.

### Lỗi: setup.bat tự tắt sau khi cài thư viện

Chạy trực tiếp trong CMD (không double-click):
```bash
cd C:\đường-dẫn-đến-project
setup.bat
```

### Lỗi: BioBERT load chậm lần đầu

Bình thường — BioBERT model (~400MB) cần 10-15 giây để load vào RAM lần đầu. Từ lần sau sẽ nhanh hơn.

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
│   │   ├── interactions.py  ← F3 tương tác thuốc
│   │   └── oauth.py         ← Google, GitHub OAuth
│   ├── core/
│   │   ├── config.py        ← Cấu hình từ .env
│   │   ├── database.py      ← Kết nối PostgreSQL
│   │   ├── security.py      ← JWT, bcrypt
│   │   └── deps.py          ← Dependencies (auth guard)
│   ├── models/models.py     ← Database models (7 bảng)
│   └── schemas/schemas.py   ← Request/Response schemas
├── ml/
│   ├── train_biobert.py     ← Train BioBERT+LightGBM (Kaggle T4)
│   ├── train_lightgbm.py    ← Train LightGBM TF-IDF
│   ├── train_xgboost.py     ← Train XGBoost
│   ├── train_mlp.py         ← Train MLP PyTorch (Kaggle T4)
│   ├── evaluate_models.py   ← So sánh 4 models
│   ├── predictor.py         ← DDAPredictor service class
│   └── artifacts/           ← Model files (.pkl, .npz)
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

4 model đã train, lưu tại `ml/artifacts/`:

| Model | AUC-ROC | F1-Score | Thư mục |
|---|---|---|---|
| **BioBERT + LightGBM** | **0.9632** | **0.9014** | `ml/artifacts/biobert/` |
| MLP (PyTorch) | 0.9058 | 0.8288 | `ml/artifacts/mlp/` |
| LightGBM (TF-IDF) | 0.8999 | 0.8174 | `ml/artifacts/lightgbm/` |
| XGBoost (TF-IDF) | 0.8335 | 0.7360 | `ml/artifacts/xgboost/` |

Model mặc định dùng trong API: **BioBERT + LightGBM**

> **Lưu ý:** Model artifacts không được commit lên GitHub do kích thước lớn. Download từ Release và giải nén vào `ml/artifacts/`.

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
| GET | `/auth/google/login` | Đăng nhập qua Google | Không |
| GET | `/auth/github/login` | Đăng nhập qua GitHub | Không |

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
  "drug_name": "Aspirin",
  "disease_name": "Type 2 Diabetes",
  "score": 0.2537,
  "confidence": "Low"
}
```

**Confidence levels:** `High` (≥0.7) · `Medium` (0.4–0.7) · `Low` (<0.4)

**Luồng Frontend:**
```
GET /drugs/search?name=xxx   → lấy drug_id
GET /diseases/search?name=xxx → lấy disease_id
POST /predict/single {drug_id, disease_id}
```

### F2 — Top 5 thuốc theo bệnh

```
GET /predict/top5/{disease_id}
```

### F3 — Kiểm tra tương tác thuốc

```
POST /interactions/check
Body: { "drug_names": ["Aspirin", "Warfarin", "Metformin"] }
Giới hạn: tối đa 10 thuốc
```

### Admin (Cần role admin)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/admin/users` | Danh sách tất cả users |
| PATCH | `/admin/users/{id}/role` | Đổi role (user/admin) |
| PATCH | `/admin/users/{id}/status` | Kích hoạt/vô hiệu hóa |
| DELETE | `/admin/users/{id}` | Xóa user |
| GET | `/admin/stats` | Thống kê hệ thống |

---

## Hướng dẫn cho Frontend

### Luồng Authentication

```
1. POST /auth/register hoặc /auth/google/login hoặc /auth/github/login
2. POST /auth/login → nhận access_token
3. Lưu token vào localStorage
4. Mọi request cần auth → thêm header:
   Authorization: Bearer <token>
5. GET /auth/me → lấy thông tin và role của user
```

### Phân quyền

```
Guest  → đăng ký, đăng nhập
User   → F1, F2, F3, lịch sử, đổi mật khẩu
Admin  → tất cả quyền User + /admin/* routes
```

### OAuth Callback

Sau khi OAuth thành công, backend redirect về:
```
{FRONTEND_URL}/oauth/callback?token=JWT_TOKEN&username=USERNAME
```
Frontend cần có trang `/oauth/callback` để nhận token và lưu vào localStorage.

---

## Tạo tài khoản Admin

```bash
python -c "
import sys; sys.path.append('.')
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.models import User
db = SessionLocal()
db.add(User(username='admin', email='admin@hachimi.com',
            password=hash_password('adminpassword123'), role='admin', is_active=1))
db.commit()
print('Admin created!')
db.close()
"
```

---

## Hướng dẫn chạy Frontend (React + Vite)

Frontend được phát triển bằng React 18, Vite, TailwindCSS và ThreeJS (cho biểu đồ 3D).

### Bước 1: Di chuyển vào thư mục Frontend
```bash
cd hachimi-frontend
```

### Bước 2: Cài đặt thư viện
```bash
npm install
```
*(Lưu ý: `package.json` đã cấu hình sẵn toàn bộ các thư viện cần thiết như UI, `react-force-graph-3d`, `three`, Tailwind và Axios. Do đó, chỉ cần lệnh trên là đủ).*

### Bước 3: Khởi chạy ứng dụng
```bash
npm run dev
```
Frontend sẽ tự động kết nối với Backend. Mở trình duyệt: http://localhost:5173

---

## Ghi chú về Thư viện Backend (Dependencies)

Trong quá trình hoàn thiện hệ thống, các tính năng bảo mật Auth/OAuth và AI Model đã được bổ sung. Các thư viện quan trọng đi kèm bao gồm:
- **Core & Database:** `fastapi`, `uvicorn`, `psycopg2-binary`, `SQLAlchemy`
- **Security & JWT:** `passlib`, `bcrypt`, `python-jose`, `python-multipart`
- **OAuth & Requests:** `httpx`
- **AI/ML:** `torch`, `scikit-learn`, `pandas`

Toàn bộ đã được khai báo chuẩn trong `requirements.txt`. Script `setup.bat` (hoặc lệnh `pip install -r requirements.txt`) sẽ tự động tải đầy đủ, người dùng không cần cài lẻ tẻ bằng tay.

---

## Liên hệ

- Backend/ML: [Tên K]
- Frontend/PM: [Tên Anh]
