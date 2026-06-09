@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"
title Faz 0 Uygula - Mahallemiz

REM ========== LOG ==========
set LOG=%~dp0faz0-uygula.log
echo. > "%LOG%"
echo [%DATE% %TIME%] Faz 0 apply (clean reinstall) started >> "%LOG%"

echo.
echo ==========================================
echo   FAZ 0 - Temiz Kurulum + Dogrulama
echo ==========================================
echo.
echo Bu script:
echo   1) package-lock.json + node_modules siler (temiz baslangic)
echo   2) npm install  (paket degisikliklerini uygular, dogru binary'leri ceker)
echo   3) test  (FAZ 0 KAPISI)
echo   4) typecheck + lint  (mevcut kod borcu - BASELINE, Faz 1 isi)
echo.
echo Hicbir sey COMMIT/PUSH ETMEZ. Log: %LOG%
echo.
echo [BASLAMAK ICIN BIR TUSA BAS]  (vazgecmek icin pencereyi kapat)
pause

REM ========== 0) on kontrol ==========
if not exist ".git" goto :err_notgit
where npm >nul 2>&1
if errorlevel 1 goto :err_nonpm

REM ========== 1) TEMIZLIK (npm bug #4828 icin onerilen cozum) ==========
echo.
echo [1/4] Temizlik: package-lock.json + node_modules siliniyor...
echo [1/4] clean: del lock + rmdir node_modules >> "%LOG%"
if exist "package-lock.json" del /f /q "package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"
echo [1/4] Temizlik tamam.

REM ========== 2) npm install (canli) ==========
echo.
echo [2/4] npm install... internet gerekir, ~1 dakika surebilir.
echo [2/4] npm install >> "%LOG%"
call npm install
if errorlevel 1 goto :err_install
echo [2/4] OK - kurulum tamam.

REM ========== 3) TEST  (FAZ 0 KAPISI) ==========
echo.
echo [3/4] Testler (vitest)...
call npm run test 1>>"%LOG%" 2>&1
if errorlevel 1 (set "TESTS=HATA") else (set "TESTS=OK")
echo [3/4] Test: !TESTS!

REM ========== 4) BASELINE: typecheck + lint (Faz 1) ==========
echo.
echo [4/4] Baseline olcum (typecheck + lint)... bunlar simdilik HATA verebilir, normal.
call npx tsc --noEmit 1>>"%LOG%" 2>&1
if errorlevel 1 (set "TYPES=HATA") else (set "TYPES=OK")
call npm run lint 1>>"%LOG%" 2>&1
if errorlevel 1 (set "LINT=HATA") else (set "LINT=OK")
echo [4/4] Typecheck: !TYPES!   Lint: !LINT!

REM ========== OZET ==========
echo.
echo ==========================================
echo   OZET
echo ==========================================
echo   FAZ 0 KAPILARI:
echo     Kurulum (install) : OK
echo     Test (vitest)     : !TESTS!
echo.
echo   BASELINE (Faz 1'de azaltilacak, simdi engel degil):
echo     Typecheck : !TYPES!   (mevcut tip borcu)
echo     Lint      : !LINT!    (mevcut kod borcu)
echo ------------------------------------------
if "!TESTS!"=="OK" (
    echo   SONUC: FAZ 0 YESIL. Kurulum + test gecti.
    echo   Gondermek icin: commit-push-coskun.bat'i calistir.
) else (
    echo   SONUC: Test hala HATA veriyor.
    echo   Log'u paylas: %LOG%  -^> bana "faz0 test" yaz.
)
echo.
echo [%DATE% %TIME%] done (test=!TESTS! types=!TYPES! lint=!LINT!) >> "%LOG%"
echo Log: %LOG%
echo.
pause
exit /b 0

REM ========================================================
:err_notgit
echo [HATA] Bu klasor bir git deposu degil. Yanlis klasorde olabilirsin.
pause
exit /b 1

:err_nonpm
echo [HATA] npm bulunamadi. Node.js kurulu mu? https://nodejs.org (LTS surumu)
pause
exit /b 1

:err_install
echo.
echo [HATA] npm install basarisiz. Log: %LOG%
echo Internet baglantisini kontrol et, sonra tekrar dene.
pause
exit /b 1
