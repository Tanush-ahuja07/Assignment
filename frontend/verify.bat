@echo off
REM Setup Verification Script for Windows

cls
echo.
echo ==================================
echo   React + Vite Setup Verification
echo ==================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js: %NODE_VERSION%
) else (
    echo [ERROR] Node.js not found
    echo Please install Node.js 18 or higher from https://nodejs.org
    pause
    exit /b 1
)

REM Check npm
echo Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm: %NPM_VERSION%
) else (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

REM Check package.json
echo.
echo Checking directory...
if exist "package.json" (
    echo [OK] package.json found
) else (
    echo [ERROR] package.json not found
    echo Please run this from the frontend directory
    pause
    exit /b 1
)

REM Check node_modules
echo Checking dependencies...
if exist "node_modules" (
    echo [OK] node_modules exists
) else (
    echo [WARNING] node_modules not found
    echo Installing dependencies...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check src directory
echo Checking source files...
if exist "src" (
    echo [OK] src directory found
) else (
    echo [ERROR] src directory not found
    pause
    exit /b 1
)

REM Check vite config
if exist "vite.config.ts" (
    echo [OK] vite.config.ts found
) else (
    echo [ERROR] vite.config.ts not found
    pause
    exit /b 1
)

REM Check .env
if exist ".env" (
    echo [OK] .env found
) else (
    echo [WARNING] .env not found
    echo Creating from example...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] .env created
    ) else (
        echo [ERROR] .env.example not found
        pause
        exit /b 1
    )
)

REM All checks passed
echo.
echo ==================================
echo   [OK] All checks passed!
echo ==================================
echo.
echo Next steps:
echo   1. Make sure backend is running on http://localhost:3000
echo   2. Run: npm run dev
echo   3. Open browser to http://localhost:5173
echo.
echo Happy coding!
echo.
pause
