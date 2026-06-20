"""
Unit tests cho app/core/security.py
Chạy: pytest tests/test_security.py -v
"""
import pytest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)


class TestHashPassword:
    def test_hash_khac_plaintext(self):
        """Mật khẩu sau khi hash phải khác plaintext"""
        hashed = hash_password("testpass123")
        assert hashed != "testpass123"

    def test_hash_dung_format_bcrypt(self):
        """Kết quả phải đúng format bcrypt ($2b$)"""
        hashed = hash_password("testpass123")
        assert hashed.startswith("$2b$")

    def test_hai_lan_hash_khac_nhau(self):
        """Cùng password nhưng hash 2 lần phải cho kết quả khác (salt ngẫu nhiên)"""
        h1 = hash_password("testpass123")
        h2 = hash_password("testpass123")
        assert h1 != h2

    def test_hash_password_ngan(self):
        """Password ngắn vẫn hash được"""
        hashed = hash_password("abc")
        assert hashed.startswith("$2b$")

    def test_hash_password_unicode(self):
        """Password có tiếng Việt vẫn hash được"""
        hashed = hash_password("mậtkhẩu123")
        assert hashed.startswith("$2b$")


class TestVerifyPassword:
    def test_verify_dung_password(self):
        """Verify đúng password phải trả về True"""
        hashed = hash_password("testpass123")
        assert verify_password("testpass123", hashed) is True

    def test_verify_sai_password(self):
        """Verify sai password phải trả về False"""
        hashed = hash_password("testpass123")
        assert verify_password("wrongpass", hashed) is False

    def test_verify_password_rong(self):
        """Verify password rỗng phải trả về False"""
        hashed = hash_password("testpass123")
        assert verify_password("", hashed) is False

    def test_verify_khong_case_sensitive(self):
        """Password phân biệt hoa thường"""
        hashed = hash_password("TestPass123")
        assert verify_password("testpass123", hashed) is False
        assert verify_password("TESTPASS123", hashed) is False
        assert verify_password("TestPass123", hashed) is True


class TestCreateAccessToken:
    def test_tao_token_thanh_cong(self):
        """Tạo token không raise exception"""
        token = create_access_token({"sub": "1", "role": "user"})
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_co_3_phan(self):
        """JWT token phải có 3 phần ngăn cách bởi dấu chấm"""
        token = create_access_token({"sub": "1", "role": "user"})
        parts = token.split(".")
        assert len(parts) == 3

    def test_token_admin(self):
        """Tạo token với role admin"""
        token = create_access_token({"sub": "99", "role": "admin"})
        assert token is not None


class TestDecodeAccessToken:
    def test_decode_token_hop_le(self):
        """Decode token hợp lệ phải trả về payload đúng"""
        token = create_access_token({"sub": "1", "role": "user"})
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "1"
        assert payload["role"] == "user"

    def test_decode_token_khong_hop_le(self):
        """Decode token không hợp lệ phải trả về None"""
        result = decode_access_token("invalid.token.here")
        assert result is None

    def test_decode_token_rong(self):
        """Decode chuỗi rỗng phải trả về None"""
        result = decode_access_token("")
        assert result is None

    def test_decode_token_bi_chinh_sua(self):
        """Decode token bị chỉnh sửa phải trả về None"""
        token = create_access_token({"sub": "1", "role": "user"})
        tampered = token[:-5] + "XXXXX"
        result = decode_access_token(tampered)
        assert result is None

    def test_decode_giu_nguyen_payload(self):
        """Payload sau decode phải giống payload gốc"""
        data = {"sub": "42", "role": "admin"}
        token = create_access_token(data)
        payload = decode_access_token(token)
        assert payload["sub"] == "42"
        assert payload["role"] == "admin"
