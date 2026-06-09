@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
title types.ts Regen - canli Supabase semasindan

echo.
echo ==========================================
echo   types.ts REGEN - canli semadan uret
echo ==========================================
echo.
echo Bu script src\lib\supabase\types.ts'i CANLI Supabase semasindan yeniden uretir.
echo - Ilk seferde tarayicidan "supabase login" gerekebilir (bir kez, token Claude'a gitmez).
echo - GUVENLI: once gecici dosyaya uretir, boyutu dogrular, eskisini .bak yapar, sonra degistirir.
echo   Uretim basarisizsa mevcut types.ts'e DOKUNULMAZ.
echo.
echo [BASLAMAK ICIN BIR TUSA BAS]  (vazgecmek icin pencereyi kapat)
pause

if not exist "src\lib\supabase\types.ts" goto :err_notarget

echo.
echo [1/4] Supabase CLI login (gerekirse tarayici acilir; zaten girisliysen gecer)...
call npx -y supabase@latest login

echo.
echo [2/4] types.ts uretiliyor (gecici dosyaya)...
call npx -y supabase@latest gen types typescript --project-id dogjnzcofvpsqbepdaek > "src\lib\supabase\types.ts.new" 2> "regen-types-error.txt"

set SIZE=0
for %%A in ("src\lib\supabase\types.ts.new") do set SIZE=%%~zA
echo Uretilen boyut: !SIZE! bayt
if !SIZE! LSS 5000 goto :err_small

echo.
echo [3/4] Yedek aliniyor (types.ts.bak) ve yeni surum yerlestiriliyor...
copy /y "src\lib\supabase\types.ts" "src\lib\supabase\types.ts.bak" >nul
move /y "src\lib\supabase\types.ts.new" "src\lib\supabase\types.ts" >nul

echo.
echo [4/4] TAMAM - types.ts canli semadan yenilendi. (Eski hali: src\lib\supabase\types.ts.bak)
echo.
echo Simdi Claude'a "types regen tamam" yaz. tsc ile kontrol edip @ts-nocheck'leri
echo ve as any'leri temizleyecek; cascade cikarsa duzeltecek. (Sorun olursa .bak ile geri alinir.)
echo.
pause
exit /b 0

:err_small
echo.
echo [HATA] Uretilen dosya cok kucuk/bos -> uretim BASARISIZ. Mevcut types.ts'e DOKUNULMADI (guvenli).
echo Muhtemelen login gerekiyor ya da CLI hatasi. Detay asagida:
echo ------------------------------------------
type "regen-types-error.txt" 2>nul
echo ------------------------------------------
del "src\lib\supabase\types.ts.new" 2>nul
echo Claude'a "regen hata" yazip bu ciktiyi paylas.
pause
exit /b 1

:err_notarget
echo [HATA] src\lib\supabase\types.ts bulunamadi. Yanlis klasor?
pause
exit /b 1
