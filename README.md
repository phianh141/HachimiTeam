dda-backend 

Cách sử dụng
1. Cài docker và bật app lên
<<<<<<< HEAD
2. Mở file .env_sample lên đổi tên file -> .env
3. CHỉnh sửa file này đúng theo cấu hình của máy
4. Chạy file set_up.bat
5. Kiểm tra db đã up chưa chạy lệnh này "docker ps" ở terminal ide
6. Chạy backend. Chạy lên này "uvicorn main:app --reload" ở terminal ide
7. Ctrl + c ở địa chỉ ip để mở  sau +  "/docs" để mở fast api
8. Kiểm tra fast_api coi các chức năng chính có hoạt động không
9. Báo lại kết quả
=======
2. Chạy file set_up.bat
3. Kiểm tra db đã up chưa chạy lệnh này "docker ps" ở terminal ide
4. Chạy backend. Chạy lên này "uvicorn main:app --reload" ở terminal ide
5. Ctrl + c ở địa chỉ ip để mở  sau +  "/docs" để mở fast api
5. Kiểm tra fast_api coi các chức năng chính có hoạt động không
6. Báo lại kết quả
>>>>>>> af27bbf (Feat:Update set_up.bat and README.md)

Chức năng chính của backend (Có thể tự test fast_api )
1. Dự đoán liên kết thuốc
INPUT: 1 thuốc : 1 bệnh
OUTPUT: Tỷ lệ liên kết thuốc với nhau + mức độ liên kết
Yêu cầu: Làm tương tự chức năng này

2. Top 5 thuốc liên kết cao với bệnh
INPUT: 1 Bệnh
OUTPUT: Top 5 thuốc có tỷ lệ liên kết cao nhất với bệnh + mức độ liên kết
Yêu cầu: Làm tương tự với chức năng này, tuy nhiên ở phần dự đoán liên kết thuốc sẽ trả về thêm top 5 thuốc có tỷ lệ liên kết cao nhất với bệnh. 

3. Tương tác thuốc
INPUT: List thuốc
OUTPUT: Kết quả tương tác giữa các cặp thuốc với nhau
Yêu cầu: Làm tương tự chức năng trên

## Đây mới là mới là bản thửu nghiệm để hình dung làm frontend trước. Sẽ cập nhật repo liên tục sau



<<<<<<< HEAD
=======

>>>>>>> af27bbf (Feat:Update set_up.bat and README.md)
