@echo off
chcp 65001 >nul
REM Installe le studio Remotion de TikBet sous Windows (le Motion Reel Kit, lui, demande WSL).
where node >nul 2>nul || (
  echo Installation de Node.js LTS...
  winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  echo Ferme cette fenetre puis relance ce script pour que Node soit pris en compte.
  pause
  exit /b
)
cd /d "%~dp0studio"
call npm install --no-audit --no-fund --loglevel=error || (echo Echec de npm install & pause & exit /b 1)
echo.
echo Termine.
echo   Preview : cd studio ^&^& npm run dev   (ouvre http://localhost:3000)
echo   Rendu   : cd studio ^&^& npx remotion render TikTok out/tiktok.mp4
pause
