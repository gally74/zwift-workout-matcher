@echo off
echo 🚴 Starting Zwift Workout Route Matcher...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Download the "LTS" version and run the installer.
    echo.
    pause
    exit /b 1
)

REM Navigate to the project directory
cd /d "%~dp0"

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies for the first time...
    npm run install-all
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
)

REM Start the application
echo 🚀 Starting the application...
echo.
echo The app will open in your browser at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application when you're done.
echo.
npm run dev

pause 