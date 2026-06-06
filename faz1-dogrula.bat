@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Faz 1 Dogrula - Mahallemiz

set LOG=%~dp0faz1-dogrula.log
echo. > "%LOG%"
echo [%DATE% %TIME%] Faz 1 verify started >> "%LOG%"

echo.
echo ==========================================
echo   FAZ 1 - Tip + Build Dogrulama
echo ==========================================
echo.
echo   1) tsc --noEmit   (101 tip hatasi sifirlandi mi?)
echo   2) next build     (URETIM BUILD - gercek kapi)
echo   3) test           (14/14 hala geciyor mu?)
echo.
echo Kurulum GEREKMEZ (Faz 1 sadece kaynak kod degistirdi).
echo Build birkac dakika surebilir. Log: %LOG%
echo.
echo [BASLAMAK ICIN BIR TUSA BAS]  (vazgecmek icin pencereyi kapat)
pause

if not exist ".git" goto :err_notgit
if not exist "node_modules" goto :err_nomodules

REM ========== 1) TYPECHECK ==========
echo.
echo [1/3] Typecheck (tsc --noEmit)...
call npx tsc --noEmit 1>>"%LOG%" 2>&1
if errorlevel 1 (set "TYPES=HATA") else (set "TYPES=OK")
echo [1/3] Typecheck: !TYPES!

REM ========== 2) BUILD (canli gosterilir) ==========
echo.
echo [2/3] Production build (next build)... lutfen bekle, birkac dakika surer.
call npm run build
if errorlevel 1 (set "BUILD=HATA") else (set "BUILD=OK")
echo [2/3] Build: !BUILD!

REM ========== 3) TEST ==========
echo.
echo [3/3] Test (vitest)...
call npm run test 1>>"%LOG%" 2>&1
if errorlevel 1 (set "TESTS=HATA") else (set "TESTS=OK")
echo [3/3] Test: !TESTS!

REM ========== OZET ==========
echo.
echo ==========================================
echo   OZET
echo ==========================================
echo   Typecheck : !TYPES!
echo   Build     : !BUILD!
echo   Test      : !TESTS!
echo ------------------------------------------
if "!TYPES!!BUILD!!TESTS!"=="OKOKOK" (
    echo   SONUC: FAZ 1 YESIL - tip temiz, uretim build geciyor.
    echo   Gondermek icin: commit-push-coskun.bat
) else (
    echo   SONUC: Bazi adimlar HATA verdi.
    echo   Build ekrandaki hatayi gosterir; tsc/test detayi: %LOG%
    echo   Bana "faz1 sonuc" yazip hatayi paylas, kalanini birlikte cozelim.
)
echo.
echo [%DATE% %TIME%] done (types=!TYPES! build=!BUILD! test=!TESTS!) >> "%LOG%"
echo Log: %LOG%
echo.
pause
exit /b 0

REM ========================================================
:err_notgit
echo [HATA] Bu klasor bir git deposu degil. Yanlis klasorde olabilirsin.
pause
exit /b 1

:err_nomodules
echo [HATA] node_modules yok. Once faz0-uygula.bat'i calistir.
pause
exit /b 1
