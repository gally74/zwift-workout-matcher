@echo off
title Create Zip Package
color 0A

echo.
echo ========================================
echo   Creating Zip Package for Sharing
echo ========================================
echo.

REM Check if the shared package exists
if not exist "ZwiftWorkoutMatcher-Shared" (
    echo ❌ Shared package not found!
    echo Please run CREATE_PORTABLE_PACKAGE.bat first.
    pause
    exit /b 1
)

echo 📦 Creating zip file...

REM Use PowerShell to create zip (available on Windows 10+)
powershell -command "Compress-Archive -Path 'ZwiftWorkoutMatcher-Shared' -DestinationPath 'ZwiftWorkoutMatcher-Package.zip' -Force"

if exist "ZwiftWorkoutMatcher-Package.zip" (
    echo.
    echo ✅ Zip package created successfully!
    echo.
    echo 📦 Package: ZwiftWorkoutMatcher-Package.zip
    echo 📁 Size: 
    for %%A in (ZwiftWorkoutMatcher-Package.zip) do echo    %%~zA bytes
    echo.
    echo 🚀 Ready to share!
    echo.
    echo 📋 To share:
    echo    1. Send ZwiftWorkoutMatcher-Package.zip to others
    echo    2. They extract the zip file
    echo    3. Double-click ZwiftWorkoutMatcher.exe to run
    echo.
    echo 📝 Instructions for recipients:
    echo    - Extract the zip file
    echo    - Install Node.js from https://nodejs.org/ (if not already installed)
    echo    - Double-click ZwiftWorkoutMatcher.exe
    echo    - Follow the on-screen instructions
    echo.
) else (
    echo ❌ Failed to create zip file!
    echo.
    echo 💡 Alternative: Manually zip the ZwiftWorkoutMatcher-Shared folder
)

pause 