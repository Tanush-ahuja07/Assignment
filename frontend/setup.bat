@echo off
REM React + Vite Setup for Windows

echo ===================================
echo   BookItNow- React + Vite Setup
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js 18 or higher from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version

echo.
echo Installing dependencies with npm...
echo (This may take a few minutes)
echo.

cd /d "%~dp0"
npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ===================================
echo   Installation Complete!
echo ===================================
echo.
echo Next steps:
echo   1. Make sure your backend API is running on http://localhost:3000
echo   2. Update .env if your API is on a different URL
echo   3. Run: npm run dev
echo.
echo Happy coding! 🚀
echo.
pause
