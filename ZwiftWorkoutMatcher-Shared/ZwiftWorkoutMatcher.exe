@echo off
title Zwift Workout Route Matcher
color 0A

echo.
echo ========================================
echo   Zwift Workout Route Matcher Launcher
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Download the "LTS" version and run the installer.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo ✅ Node.js is installed

REM Navigate to the project directory
cd /d "%~dp0"

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies for the first time...
    echo This may take a few minutes...
    echo.
    npm run install-all
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting Zwift Workout Route Matcher...
echo.
echo The app will open in your browser at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application when you're done.
echo.

REM Start the application
npm run dev

echo.
echo Application stopped.
echo Press any key to exit...
pause >nul 