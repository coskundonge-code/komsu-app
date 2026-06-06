@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Gonder - Mahallemiz (dogrula + commit + push)

set LOG=%~dp0gonder.log
echo. > "%LOG%"
echo [%DATE% %TIME%] gonder started >> "%LOG%"

echo.
echo ==========================================
echo   GONDER - tek tik: dogrula + commit + push
echo ==========================================
echo.
echo Sirasiyla:  tsc (tip)  -^>  test  -^>  commit + push
echo Dogrulama GECMEZSE push YAPILMAZ (bozuk kod gitmez).
echo Not: tam uretim build'i icin ayrica faz1-dogrula.bat.
echo.
echo [BASLAMAK ICIN BIR TUSA BAS]  (vazgecmek icin pencereyi kapat)
pause

if not exist ".git" goto :err_notgit
where npm >nul 2>&1
if errorlevel 1 goto :err_nonpm
if not exist "node_modules" goto :err_nomodules

REM ========== 1) TYPECHECK ==========
echo.
echo [1/3] Typecheck (tsc --noEmit)...
call npx tsc --noEmit 1>>"%LOG%" 2>&1
if errorlevel 1 goto :verifyfail
echo [1/3] Typecheck: OK

REM ========== 2) TEST ==========
echo [2/3] Test (vitest)...
call npm run test 1>>"%LOG%" 2>&1
if errorlevel 1 goto :verifyfail
echo [2/3] Test: OK

REM ========== 3) COMMIT + PUSH (mevcut guvenli bat'i cagir) ==========
echo.
echo [3/3] Dogrulama gecti. Commit + push baslatiliyor...
echo [%DATE% %TIME%] verify OK -> calling commit-push-coskun.bat >> "%LOG%"
echo.
call "%~dp0commit-push-coskun.bat"
echo.
echo ==========================================
echo   GONDER tamamlandi.
echo ==========================================
exit /b 0

REM ========================================================
:verifyfail
echo.
echo ==========================================
echo   DURDU - DOGRULAMA BASARISIZ, PUSH YAPILMADI
echo ==========================================
echo Bozuk kod gonderilmedi. Detay: %LOG%
echo Claude'a "gonder hata" yazip log'u paylas, birlikte cozelim.
echo [%DATE% %TIME%] verify FAILED -> push skipped >> "%LOG%"
echo.
pause
exit /b 1

:err_notgit
echo [HATA] Bu klasor bir git deposu degil.
pause
exit /b 1
:err_nonpm
echo [HATA] npm bulunamadi (Node.js kurulu mu? https://nodejs.org).
pause
exit /b 1
:err_nomodules
echo [HATA] node_modules yok. Once faz0-uygula.bat calistir.
pause
exit /b 1
