@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

REM ========== PROJE ADI ==========
for %%I in ("%CD%") do set PROJECT_NAME=%%~nxI
title Commit + Push - !PROJECT_NAME!

REM ========== LOG EVERYTHING ==========
set LOG=%~dp0commit-push-coskun.log
echo. > "%LOG%"
echo [%DATE% %TIME%] Script started (project: !PROJECT_NAME!) >> "%LOG%"

echo.
echo ==========================================
echo   !PROJECT_NAME! - commit + push
echo ==========================================
echo.
echo Log dosyasi: %LOG%
echo.
echo [BASLAMAK ICIN BIR TUSA BAS]
pause

REM ========== 0) .git KONTROL ==========
if not exist ".git" (
    echo [HATA] Bu klasor bir git deposu degil.
    pause
    exit /b 1
)

REM ========== 1) STALE LOCK TEMIZLE ==========
if exist ".git\index.lock" (
    echo [1/7] .git\index.lock bulundu, siliniyor...
    echo [1/7] removing stale .git\index.lock >> "%LOG%"
    del /f /q ".git\index.lock" 2>>"%LOG%"
    if exist ".git\index.lock" (
        echo [HATA] Lock silinemedi. Manuel sil:
        echo         del "%~dp0.git\index.lock"
        pause
        exit /b 1
    )
) else (
    echo [1/7] Lock yok, devam.
)

REM ========== 1b) PHANTOM WORKTREE TEMIZLE (.git\worktrees tarafi) ==========
if exist ".git\worktrees" (
    for /d %%W in (".git\worktrees\*") do (
        if exist "%%W\gitdir" (
            set "WT_PATH="
            set /p WT_PATH=<"%%W\gitdir"
            if not "!WT_PATH!"=="" (
                if not exist "!WT_PATH!" (
                    echo [1b/7] Phantom worktree siliniyor: %%~nxW
                    echo [1b/7] removing phantom worktree %%~nxW (gitdir was !WT_PATH!) >> "%LOG%"
                    rmdir /s /q "%%W"
                )
            )
        )
    )
)

REM ========== 1c) ORPHAN CLAUDE CODE WORKTREE TEMIZLE (.claude\worktrees tarafi) ==========
REM Claude Code eski session artifactlari -- .git\worktrees bos ise bunlar orphan
if exist ".claude\worktrees" (
    set "GIT_WT_EMPTY=1"
    if exist ".git\worktrees" (
        for /d %%W in (".git\worktrees\*") do set "GIT_WT_EMPTY=0"
    )
    if "!GIT_WT_EMPTY!"=="1" (
        echo [1c/7] Orphan .claude\worktrees bulundu, siliniyor...
        echo [1c/7] removing orphan .claude\worktrees (no active entries in .git\worktrees) >> "%LOG%"
        rmdir /s /q ".claude\worktrees" 2>>"%LOG%"
        if exist ".claude\worktrees" (
            echo [UYARI] .claude\worktrees silinemedi. Explorer'dan manuel sil:
            echo         "%~dp0.claude\worktrees"
        )
    ) else (
        echo [1c/7] .git\worktrees'te aktif entry var, .claude\worktrees'e dokunmuyorum.
    )
)

REM ========== 2) TARGET BRANCH TESPIT (coskun ^> main ^> master ^> current) ==========
set TARGET=
git show-ref --verify --quiet refs/heads/coskun
if not errorlevel 1 set TARGET=coskun
if "!TARGET!"=="" (
    git show-ref --verify --quiet refs/heads/main
    if not errorlevel 1 set TARGET=main
)
if "!TARGET!"=="" (
    git show-ref --verify --quiet refs/heads/master
    if not errorlevel 1 set TARGET=master
)
if "!TARGET!"=="" (
    for /f %%b in ('git branch --show-current 2^>^&1') do set TARGET=%%b
)
echo [2/7] Target branch: !TARGET!
echo [2/7] target=!TARGET! >> "%LOG%"

REM ========== 3) DOGRU BRANCH'E GEC ==========
for /f %%b in ('git branch --show-current 2^>^&1') do set CURBR=%%b
if /i not "!CURBR!"=="!TARGET!" (
    echo [i] Su anda "!CURBR!" branch'indesin. !TARGET!'e geciyorum...
    git checkout !TARGET! 1>>"%LOG%" 2>&1
    if errorlevel 1 (
        echo [HATA] !TARGET! branch'ine gecilemedi. Log: %LOG%
        pause
        exit /b 1
    )
)

REM ========== 4) STATUS + ADD ==========
echo.
echo [3/7] Degisiklik listesi:
git status --short
git status --short >> "%LOG%"
echo.

echo [4/7] Tum degisiklikleri stage ediyorum...
echo [4/7] git add -A >> "%LOG%"
git add -A 1>>"%LOG%" 2>&1
if errorlevel 1 (
    echo [HATA] git add basarisiz. Log: %LOG%
    pause
    exit /b 1
)

REM ========== 5) COMMIT ==========
git diff --cached --quiet
if errorlevel 1 (
    echo.
    echo [5/7] Commit mesaji yaz - bos birakirsan tarih-saat otomatik:
    set /p MSG=">>> "
    if "!MSG!"=="" (
        for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value ^| find "="') do set dt=%%a
        set MSG=update: local changes on !TARGET! (!dt:~0,4!-!dt:~4,2!-!dt:~6,2! !dt:~8,2!:!dt:~10,2!)
    )
    echo [5/7] commit msg: !MSG! >> "%LOG%"
    git commit -m "!MSG!" 1>>"%LOG%" 2>&1
    if errorlevel 1 (
        echo [HATA] Commit basarisiz. Log: %LOG%
        pause
        exit /b 1
    )
    echo [OK] Commit atildi.
) else (
    echo [5/7] Commit edilecek bir degisiklik yok. Atliyorum.
    echo [5/7] nothing to commit >> "%LOG%"
)

REM ========== 6) FETCH + REBASE ==========
echo.
echo [6/7] Remote'dan guncel halini aliyorum (rebase + autostash)...
echo [6/7] git fetch + pull --rebase --autostash >> "%LOG%"
git fetch origin 1>>"%LOG%" 2>&1
git show-ref --verify --quiet refs/remotes/origin/!TARGET!
if errorlevel 1 (
    echo [i] Remote'ta !TARGET! yok, ilk push olacak.
    echo [6/7] remote branch yok, pull atlandi >> "%LOG%"
) else (
    git pull --rebase --autostash origin !TARGET! 1>>"%LOG%" 2>&1
    if errorlevel 1 (
        echo.
        echo [UYARI] Rebase sirasinda conflict var.
        echo  1) Dosyalari duzenle
        echo  2) git add ^<dosya^>
        echo  3) git rebase --continue
        echo Iptal: git rebase --abort
        echo Log: %LOG%
        pause
        exit /b 1
    )
)

REM ========== 7) PUSH ==========
echo.
echo [7/7] origin/!TARGET!'e push ediyorum...
echo [7/7] git push origin !TARGET! >> "%LOG%"
git push -u origin !TARGET! 1>>"%LOG%" 2>&1
if errorlevel 1 (
    echo.
    echo [HATA] Push basarisiz. Muhtemelen PAT suresi dolmus.
    echo Claude'a "PAT'i yenile" de. Log: %LOG%
    pause
    exit /b 1
)

REM ========== GITHUB URL ==========
set GHURL=
for /f "tokens=*" %%u in ('git remote get-url origin 2^>nul') do set GHURL=%%u
set GHURL=!GHURL:.git=!
REM PAT varsa (URL'de @ varsa) strip et
echo !GHURL! | findstr "@" >nul
if not errorlevel 1 (
    for /f "tokens=2 delims=@" %%a in ("!GHURL!") do set GHURL=https://%%a
)

echo.
echo ==========================================
echo   TAMAM - !TARGET! branch'i guncel.
echo ==========================================
echo.
if not "!GHURL!"=="" (
    echo GitHub: !GHURL!/tree/!TARGET!
)
echo Log: %LOG%
echo.
echo [%DATE% %TIME%] Script completed OK >> "%LOG%"
pause
