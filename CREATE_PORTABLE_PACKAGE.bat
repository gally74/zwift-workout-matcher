@echo off
title Create Portable Package
color 0A

echo.
echo ========================================
echo   Creating Portable Package
echo ========================================
echo.

REM Create the package directory
if not exist "ZwiftWorkoutMatcher-Shared" mkdir "ZwiftWorkoutMatcher-Shared"
if not exist "ZwiftWorkoutMatcher-Shared\sample-workouts" mkdir "ZwiftWorkoutMatcher-Shared\sample-workouts"

echo 📁 Creating package directory...

REM Copy the batch file as the main executable
copy "ZwiftWorkoutMatcher.bat" "ZwiftWorkoutMatcher-Shared\ZwiftWorkoutMatcher.exe"

REM Copy documentation
copy "README.txt" "ZwiftWorkoutMatcher-Shared\"
copy "INSTALL.txt" "ZwiftWorkoutMatcher-Shared\"

REM Copy sample workouts
copy "sample-workouts\*.zwo" "ZwiftWorkoutMatcher-Shared\sample-workouts\"

REM Copy the entire project (for when Node.js is available)
xcopy /E /I /Y "server" "ZwiftWorkoutMatcher-Shared\server"
xcopy /E /I /Y "client" "ZwiftWorkoutMatcher-Shared\client"
copy "package.json" "ZwiftWorkoutMatcher-Shared\"

echo.
echo ✅ Portable package created successfully!
echo.
echo 📦 Package location: ZwiftWorkoutMatcher-Shared\
echo.
echo 📋 Package contents:
echo    - ZwiftWorkoutMatcher.exe (main executable)
echo    - README.txt (instructions)
echo    - INSTALL.txt (installation guide)
echo    - sample-workouts\ (test files)
echo    - server\ (backend code)
echo    - client\ (frontend code)
echo    - package.json (dependencies)
echo.
echo 🚀 To share this package:
echo    1. Zip the ZwiftWorkoutMatcher-Shared folder
echo    2. Send the zip file to others
echo    3. They extract and double-click ZwiftWorkoutMatcher.exe
echo.
echo 📝 Note: Users will need Node.js installed for the app to work.
echo    The package includes instructions for installing Node.js.
echo.
pause 