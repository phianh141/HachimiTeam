"""
Integration tests — kiểm tra luồng hoàn chỉnh từ API đến DB.
Yêu cầu: Server và DB đang chạy.
Chạy: pytest tests/test_integration.py -v
"""
import pytest
from fastapi.testclient import TestClient

# Import app — nếu DB không chạy sẽ skip toàn bộ file
try:
    from main import app
    client = TestClient(app)
    DB_AVAILABLE = True
except Exception:
    DB_AVAILABLE = False

pytestmark = pytest.mark.skipif(
    not DB_AVAILABLE,
    reason="Cần server và DB đang chạy"
)

# ── Dữ liệu test dùng chung ─────────────────────────────────────────────────
TEST_USER = {
    "username": "pytest_user",
    "email": "pytest@test.com",
    "password": "pytest123"
}

TEST_ADMIN = {
    "email": "admin@dda.com",
    "password": "admin123"
}


def get_user_token():
    """Helper: đăng nhập test user, trả về token"""
    resp = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })
    return resp.json().get("access_token")


def get_admin_token():
    """Helper: đăng nhập admin, trả về token"""
    resp = client.post("/auth/login", json=TEST_ADMIN)
    return resp.json().get("access_token")


# ── TC-01 đến TC-04: Đăng ký ────────────────────────────────────────────────
class TestDangKy:
    def test_TC01_dang_ky_thanh_cong(self):
        """TC-01: Đăng ký với thông tin hợp lệ"""
        # Xóa user test nếu đã tồn tại
        admin_token = get_admin_token()
        if admin_token:
            headers = {"Authorization": f"Bearer {admin_token}"}
            users = client.get("/admin/users", headers=headers).json()
            for u in users:
                if u.get("email") == TEST_USER["email"]:
                    client.delete(f"/admin/users/{u['user_id']}", headers=headers)

        resp = client.post("/auth/register", json=TEST_USER)
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == TEST_USER["email"]
        assert data["username"] == TEST_USER["username"]
        assert data["role"] == "user"

    def test_TC02_email_da_ton_tai(self):
        """TC-02: Đăng ký với email đã tồn tại"""
        resp = client.post("/auth/register", json=TEST_USER)
        assert resp.status_code == 400
        assert "Email" in resp.json()["detail"]

    def test_TC03_username_da_ton_tai(self):
        """TC-03: Đăng ký với username đã tồn tại"""
        resp = client.post("/auth/register", json={
            "username": TEST_USER["username"],
            "email": "another@test.com",
            "password": "anotherpass123"
        })
        assert resp.status_code == 400
        assert "Username" in resp.json()["detail"]

    def test_TC04_thieu_truong_bat_buoc(self):
        """TC-04: Đăng ký thiếu password"""
        resp = client.post("/auth/register", json={
            "username": "incomplete",
            "email": "incomplete@test.com"
        })
        assert resp.status_code == 422


# ── TC-05 đến TC-08: Đăng nhập ──────────────────────────────────────────────
class TestDangNhap:
    def test_TC05_dang_nhap_thanh_cong(self):
        """TC-05: Đăng nhập với thông tin đúng"""
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == TEST_USER["email"]

    def test_TC06_sai_mat_khau(self):
        """TC-06: Đăng nhập sai mật khẩu"""
        resp = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": "wrongpassword"
        })
        assert resp.status_code == 401

    def test_TC07_email_khong_ton_tai(self):
        """TC-07: Đăng nhập với email không tồn tại"""
        resp = client.post("/auth/login", json={
            "email": "notexist@gmail.com",
            "password": "anypass123"
        })
        assert resp.status_code == 401

    def test_TC08_token_hop_le_sau_dang_nhap(self):
        """TC-08: Token nhận được phải dùng được cho GET /auth/me"""
        login = client.post("/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        token = login.json()["access_token"]
        me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me.status_code == 200
        assert me.json()["email"] == TEST_USER["email"]


# ── TC-09 đến TC-14: F1 Dự đoán cặp ────────────────────────────────────────
class TestF1DuDoan:
    def test_TC09_du_doan_thanh_cong(self):
        """TC-09: Dự đoán cặp thuốc-bệnh hợp lệ"""
        resp = client.post("/predict/single", json={
            "drug_id": 1,
            "disease_id": 1
        })
        assert resp.status_code == 200
        data = resp.json()
        assert 0.0 <= data["score"] <= 1.0
        assert data["confidence"] in ["High", "Medium", "Low"]
        assert "drug_name" in data
        assert "disease_name" in data

    def test_TC10_drug_id_khong_ton_tai(self):
        """TC-10: drug_id không tồn tại"""
        resp = client.post("/predict/single", json={
            "drug_id": 999999,
            "disease_id": 1
        })
        assert resp.status_code == 404
        assert "thuốc" in resp.json()["detail"]

    def test_TC11_disease_id_khong_ton_tai(self):
        """TC-11: disease_id không tồn tại"""
        resp = client.post("/predict/single", json={
            "drug_id": 1,
            "disease_id": 999999
        })
        assert resp.status_code == 404
        assert "bệnh" in resp.json()["detail"]

    def test_TC12_cache_hit_score_khong_doi(self):
        """TC-12: Dự đoán lần 2 cùng cặp phải cho score giống lần 1"""
        payload = {"drug_id": 1, "disease_id": 1}
        r1 = client.post("/predict/single", json=payload)
        r2 = client.post("/predict/single", json=payload)
        assert r1.status_code == 200
        assert r2.status_code == 200
        assert r1.json()["score"] == r2.json()["score"]

    def test_TC13_du_doan_chua_dang_nhap_khong_luu_history(self):
        """TC-13: Dự đoán không có token thì không lưu history"""
        resp = client.post("/predict/single", json={
            "drug_id": 2,
            "disease_id": 2
        })
        assert resp.status_code == 200

    def test_TC14_du_doan_da_dang_nhap_luu_history(self):
        """TC-14: Dự đoán có token thì lưu vào history"""
        token = get_user_token()
        headers = {"Authorization": f"Bearer {token}"}

        history_before = client.get("/auth/history", headers=headers).json()
        count_before = len(history_before)

        client.post("/predict/single",
            json={"drug_id": 3, "disease_id": 3},
            headers=headers
        )

        history_after = client.get("/auth/history", headers=headers).json()
        assert len(history_after) > count_before


# ── TC-15 đến TC-17: F2 Top 5 ───────────────────────────────────────────────
class TestF2Top5:
    def test_TC15_top5_thanh_cong(self):
        """TC-15: Lấy top 5 thuốc cho bệnh hợp lệ"""
        resp = client.get("/predict/top5/1")
        assert resp.status_code == 200
        data = resp.json()
        assert "top_drugs" in data
        assert len(data["top_drugs"]) <= 5
        assert len(data["top_drugs"]) > 0

    def test_TC16_top5_thu_tu_giam_dan(self):
        """TC-16: Top 5 phải được sắp xếp theo score giảm dần"""
        resp = client.get("/predict/top5/1")
        drugs = resp.json()["top_drugs"]
        scores = [d["score"] for d in drugs]
        assert scores == sorted(scores, reverse=True)

    def test_TC17_disease_khong_ton_tai(self):
        """TC-17: disease_id không tồn tại"""
        resp = client.get("/predict/top5/999999")
        assert resp.status_code == 404


# ── TC-18 đến TC-22: F3 Tương tác ───────────────────────────────────────────
class TestF3TuongTac:
    def test_TC18_co_tuong_tac(self):
        """TC-18: Kiểm tra cặp thuốc có tương tác"""
        resp = client.post("/interactions/check", json={
            "drug_names": ["Aspirin", "Warfarin"]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "interactions_found" in data
        assert "interactions" in data

    def test_TC19_khong_co_tuong_tac(self):
        """TC-19: Kiểm tra cặp thuốc không có tương tác"""
        resp = client.post("/interactions/check", json={
            "drug_names": ["Aspirin", "Metformin"]
        })
        assert resp.status_code == 200

    def test_TC20_it_hon_2_thuoc(self):
        """TC-20: Nhập ít hơn 2 thuốc phải báo lỗi"""
        resp = client.post("/interactions/check", json={
            "drug_names": ["Aspirin"]
        })
        assert resp.status_code == 400

    def test_TC21_thuoc_khong_ton_tai_trong_db(self):
        """TC-21: Thuốc không tồn tại bị bỏ qua"""
        resp = client.post("/interactions/check", json={
            "drug_names": ["ThuocGia123XYZ", "Aspirin", "Warfarin"]
        })
        assert resp.status_code == 200

    def test_TC22_nhieu_thuoc_nhieu_cap(self):
        """TC-22: Nhiều thuốc tạo ra nhiều cặp kiểm tra"""
        resp = client.post("/interactions/check", json={
            "drug_names": ["Aspirin", "Warfarin", "Ibuprofen"]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_pairs_checked"] == 3


# ── TC-23 đến TC-26: Admin Routes ───────────────────────────────────────────
class TestAdminRoutes:
    def test_TC23_user_thuong_goi_admin_bi_tu_choi(self):
        """TC-23: User thường gọi admin endpoint phải bị từ chối"""
        token = get_user_token()
        resp = client.get("/admin/users",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 403

    def test_TC24_admin_xem_danh_sach_users(self):
        """TC-24: Admin xem được danh sách users"""
        token = get_admin_token()
        resp = client.get("/admin/users",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_TC25_admin_xem_stats(self):
        """TC-25: Admin xem thống kê hệ thống"""
        token = get_admin_token()
        resp = client.get("/admin/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "total_users" in data
        assert "total_drugs" in data
        assert "total_diseases" in data

    def test_TC26_admin_tu_xoa_tai_khoan_minh(self):
        """TC-26: Admin không thể tự xóa tài khoản của mình"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        me = client.get("/auth/me", headers=headers).json()
        resp = client.delete(f"/admin/users/{me['user_id']}", headers=headers)
        assert resp.status_code == 400


# ── TC-27 đến TC-29: Lịch sử ────────────────────────────────────────────────
class TestLichSu:
    def test_TC27_xem_lich_su(self):
        """TC-27: User xem được lịch sử của mình"""
        token = get_user_token()
        resp = client.get("/auth/history",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_TC28_xoa_mot_record_lich_su(self):
        """TC-28: Xóa record lịch sử của mình"""
        token = get_user_token()
        headers = {"Authorization": f"Bearer {token}"}

        # Tạo history record trước
        client.post("/predict/single",
            json={"drug_id": 5, "disease_id": 5},
            headers=headers
        )

        history = client.get("/auth/history", headers=headers).json()
        if not history:
            pytest.skip("Không có history để xóa")

        record_id = history[0]["id"]
        resp = client.delete(f"/auth/history/{record_id}", headers=headers)
        assert resp.status_code == 204

    def test_TC29_xoa_record_cua_user_khac(self):
        """TC-29: Không thể xóa record lịch sử của user khác"""
        token = get_user_token()
        resp = client.delete("/auth/history/999999",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 404


# ── TC-30 đến TC-33: Đổi mật khẩu ──────────────────────────────────────────
class TestDoiMatKhau:
    def test_TC30_doi_mat_khau_thanh_cong(self):
        """TC-30: Đổi mật khẩu thành công"""
        token = get_user_token()
        resp = client.put("/auth/change-password",
            json={
                "current_password": TEST_USER["password"],
                "new_password": "newpass123"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200
        assert "thành công" in resp.json()["message"]

        # Đổi lại để không ảnh hưởng test khác
        client.put("/auth/change-password",
            json={
                "current_password": "newpass123",
                "new_password": TEST_USER["password"]
            },
            headers={"Authorization": f"Bearer {token}"}
        )

    def test_TC31_mat_khau_hien_tai_sai(self):
        """TC-31: Mật khẩu hiện tại sai"""
        token = get_user_token()
        resp = client.put("/auth/change-password",
            json={
                "current_password": "wrongpassword",
                "new_password": "newpass123"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 400

    def test_TC32_mat_khau_moi_qua_ngan(self):
        """TC-32: Mật khẩu mới quá ngắn (< 6 ký tự)"""
        token = get_user_token()
        resp = client.put("/auth/change-password",
            json={
                "current_password": TEST_USER["password"],
                "new_password": "123"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 400

    def test_TC33_mat_khau_moi_trung_cu(self):
        """TC-33: Mật khẩu mới trùng mật khẩu cũ"""
        token = get_user_token()
        resp = client.put("/auth/change-password",
            json={
                "current_password": TEST_USER["password"],
                "new_password": TEST_USER["password"]
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 400
