@echo off
chcp 65001 >nul
title Local Sync - KomsumApp (coskun)
echo.
echo ========================================
echo   KomsumApp - Local Sync
echo   Branch: coskun
echo ========================================
echo.

cd /d "%~dp0"
if errorlevel 1 (
    echo [HATA] Proje klasoru bulunamadi!
    pause
    exit /b 1
)

echo [1/4] Git fetch...
git fetch origin
if errorlevel 1 (
    echo [HATA] Git fetch basarisiz. Internet baglantinizi kontrol edin.
    pause
    exit /b 1
)

echo [2/4] Branch degistiriliyor: coskun
git checkout coskun 2>nul || git checkout -b coskun origin/coskun
if errorlevel 1 (
    echo [HATA] Branch bulunamadi: coskun
    pause
    exit /b 1
)

echo [3/4] Pull ediliyor...
git pull origin coskun
if errorlevel 1 (
    echo [UYARI] Pull sirasinda conflict olabilir. Kontrol edin.
    pause
)

echo [4/4] Dev server baslatiliyor...
echo.
echo Tarayicida aciliyor: http://localhost:3000
start http://localhost:3000
npm run dev
