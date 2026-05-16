@echo off
setlocal
CHCP 65001 >nul
title Thiết lập môi trường Python cho dự án dda-backend

echo ======================================================
echo Bắt đầu thiết lập môi trường Python cho dự án dda-backend...
echo ======================================================

:: 1. Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python chưa được cài đặt. Vui lòng cài Python trước.
    pause
    exit /b 1
)
echo [ok] Python đã được cài đặt.

:: 2. Tạo môi trường ảo
if not exist "venv" (
    echo Tạo môi trường ảo...
    python -m venv venv
) else (
    echo [!] Môi trường ảo đã tồn tại. Bỏ qua.
)

:: 3. Kích hoạt và nâng cấp pip
echo Kích hoạt môi trường ảo...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul

:: 4. Cài thư viện
if not exist "requirements.txt" (
    echo [!] Không tìm thấy requirements.txt.
    pause
    exit /b 1
) else (
    echo Cài đặt thư viện từ requirements.txt...
    pip install -r requirements.txt
    echo [ok] Thư viện đã được cài đặt.
)

:: 5. Kiểm tra Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker chưa được cài đặt. Vui lòng cài Docker Desktop trước.
    pause
    exit /b 1
)
echo [ok] Docker đã được cài đặt.

:: 6. Tạo container PostgreSQL nếu chưa có
docker ps -a --filter "name=dda-postgres" --format "{{.Names}}" | findstr "dda-postgres" >nul 2>&1
if %errorlevel% neq 0 (
    echo Tạo container PostgreSQL...
    docker run -d --name dda-postgres -e POSTGRES_USER=dda_user -e POSTGRES_PASSWORD=dda_pass -e POSTGRES_DB=dda_db -p 5432:5432 postgres:16
    echo [ok] Container dda-postgres đã được tạo.
) else (
    echo [!] Container dda-postgres đã tồn tại. Bỏ qua.
)

::7. Import data vào database
::7. Import data vào database
echo.
:ask_import
set /p "user_choice=[?] Bạn có muốn import dữ liệu vào database không? LƯU Ý chỉ import 1 lần (y/n): "

if /i "%user_choice%"=="y" (
    echo.
    if not exist "data\seed_biosnap.py" (
        echo [!] Không tìm thấy file seed_biosnap.py.
        goto end_import
    )
    if not exist "data\seed_ddi.py" (
        echo [!] Không tìm thấy file seed_ddi.py.
        goto end_import
    )

    echo Đang import BioSNAP data...
    python data\seed_biosnap.py
    if %errorlevel% neq 0 (
        echo [!] Lỗi khi import BioSNAP data.
        goto end_import
    )
    echo [ok] BioSNAP data imported.

    echo Đang import DDI data...
    python data\seed_ddi.py
    if %errorlevel% neq 0 (
        echo [!] Lỗi khi import DDI data.
        goto end_import
    )
    echo [ok] DDI data imported.
    goto end_import
)

if /i "%user_choice%"=="n" (
    echo [!] Bỏ qua bước import dữ liệu.
    goto end_import
)

echo [!] Lựa chọn không hợp lệ. Vui lòng chỉ nhập 'y' hoặc 'n'.
goto ask_import

:end_import
echo.

echo ======================================================
echo    THIẾT LẬP HOÀN TẤT!
echo ======================================================
pause