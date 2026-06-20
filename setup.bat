@echo off
setlocal
CHCP 65001 >nul
title Thiết lập môi trường dda-backend

echo ======================================================
echo   DDA Backend - Setup
echo ======================================================

:: 1. Kiểm tra Python 3.12
py -3.12 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python 3.12 chua duoc cai dat.
    echo     Tai tai: https://www.python.org/downloads/release/python-3120/
    pause
    exit /b 1
)
echo [ok] Python 3.12 da duoc cai dat.

:: 2. Kiểm tra Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Docker chua duoc cai dat hoac chua chay.
    echo     Tai tai: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [ok] Docker da san sang.

:: 3. Tạo venv bằng Python 3.12
if not exist "venv" (
    echo Tao moi truong ao Python 3.12...
    py -3.12 -m venv venv
    if %errorlevel% neq 0 (
        echo [!] Loi khi tao moi truong ao.
        pause
        exit /b 1
    )
    echo [ok] Moi truong ao da duoc tao.
) else (
    echo [!] Moi truong ao da ton tai. Bo qua.
)

:: 4. Kích hoạt venv
call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
echo [ok] pip da duoc nang cap.

:: 5. Hỏi vai trò để cài thư viện phù hợp
echo.
echo ======================================================
echo   Ban la ai trong du an nay?
echo   1. Backend / ML Developer (K)
echo      - Cai day du: Jupyter, Kaggle, debug tools
echo   2. Frontend / Thanh vien khac (Anh, Manh, My)
echo      - Chi cai thu vien can thiet de chay server
echo ======================================================
echo.

:ask_role
set /p "role_choice=[?] Nhap lua chon cua ban (1 hoac 2): "

if "%role_choice%"=="1" (
    echo.
    echo Cai dat thu vien cho Developer (day du)...
    pip install -r requirements-dev.txt
    if %errorlevel% neq 0 (
        echo [!] Loi khi cai thu vien.
        pause
        exit /b 1
    )
    echo [ok] Thu vien developer da duoc cai dat.
    goto after_install
)

if "%role_choice%"=="2" (
    echo.
    echo Cai dat thu vien cho Frontend/Member (toi gian)...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [!] Loi khi cai thu vien.
        pause
        exit /b 1
    )
    echo [ok] Thu vien da duoc cai dat.
    goto after_install
)

echo [!] Lua chon khong hop le. Chi nhap 1 hoac 2.
goto ask_role

:after_install

:: 6. Tạo hoặc khởi động container PostgreSQL
echo.
docker ps -a --filter "name=dda-postgres" --format "{{.Names}}" | findstr "dda-postgres" >nul 2>&1
if %errorlevel% neq 0 (
    echo Tao container PostgreSQL moi (port 5433)...
    docker run -d --name dda-postgres ^
        -e POSTGRES_USER=dda_user ^
        -e POSTGRES_PASSWORD=dda_pass ^
        -e POSTGRES_DB=dda_db ^
        -p 5433:5432 ^
        postgres:16
    if %errorlevel% neq 0 (
        echo [!] Loi khi tao container. Kiem tra Docker Desktop dang chay chua.
        pause
        exit /b 1
    )
    echo [ok] Container dda-postgres da duoc tao.
) else (
    echo Container dda-postgres da ton tai. Khoi dong...
    docker start dda-postgres >nul 2>&1
    echo [ok] Container dda-postgres dang chay.
)

:: 7. Chờ PostgreSQL sẵn sàng
echo Cho PostgreSQL khoi dong (10 giay)...
timeout /t 10 /nobreak >nul

:: 8. Tạo bảng database
echo Tao cau truc database...
python -c "from app.core.database import engine, Base; import app.models.models; Base.metadata.create_all(bind=engine); print('[ok] Tables created!')"
if %errorlevel% neq 0 (
    echo [!] Loi khi tao tables. Kiem tra lai ket noi DB va file .env.
    pause
    exit /b 1
)

:: 9. Hỏi import data
echo.
:ask_import
set /p "user_choice=[?] Ban co muon import du lieu vao database khong? LUU Y chi import 1 lan (y/n): "

if /i "%user_choice%"=="y" (
    echo.
    if not exist "data\seed_biosnap.py" (
        echo [!] Khong tim thay file seed_biosnap.py.
        goto end_import
    )
    if not exist "data\seed_ddi.py" (
        echo [!] Khong tim thay file seed_ddi.py.
        goto end_import
    )

    echo Dang import BioSNAP data (thuoc + benh)... Co the mat 5-10 phut.
    python data\seed_biosnap.py
    if %errorlevel% neq 0 (
        echo [!] Loi khi import BioSNAP data.
        goto end_import
    )
    echo [ok] BioSNAP data imported.

    echo Dang import DDI data (tuong tac thuoc)... Co the mat 2-3 phut.
    python data\seed_ddi.py
    if %errorlevel% neq 0 (
        echo [!] Loi khi import DDI data.
        goto end_import
    )
    echo [ok] DDI data imported.
    goto end_import
)

if /i "%user_choice%"=="n" (
    echo [!] Bo qua buoc import du lieu.
    goto end_import
)

echo [!] Lua chon khong hop le. Chi nhap 'y' hoac 'n'.
goto ask_import

:end_import
echo.
echo ======================================================
echo    THIET LAP HOAN TAT!
echo ======================================================
echo.
echo Buoc tiep theo:
echo   1. Kich hoat venv : venv\Scripts\Activate.ps1
echo   2. Chay server    : uvicorn main:app --reload
echo   3. Mo docs        : http://localhost:8000/docs
echo.
echo Neu can tao tai khoan admin:
echo   python -c "from app.core.database import SessionLocal; from app.core.security import hash_password; from app.models.models import User; db=SessionLocal(); db.add(User(username='superadmin',email='admin@dda.com',password=hash_password('admin123'),role='admin',is_active=1)); db.commit(); print('Admin created!'); db.close()"
echo.
pause
