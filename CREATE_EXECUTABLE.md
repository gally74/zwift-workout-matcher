# Creating an Executable File

## 🎯 Quick Start (Recommended)
**Double-click `ZwiftWorkoutMatcher.bat`** - This is the simplest way to run your app!

## 🚀 Creating a True Executable (.exe file)

### Prerequisites:
- Node.js installed on your computer
- All project dependencies installed

### Step-by-Step Instructions:

#### Step 1: Install the pkg tool
Open Command Prompt in your project folder and run:
```bash
npm install pkg --save-dev
```

#### Step 2: Build the client
```bash
npm run build
```

#### Step 3: Create the executable
```bash
npm run create-exe
```

#### Step 4: Find your executable
The executable will be created as `ZwiftWorkoutMatcher.exe` in your project folder.

### Alternative Commands:

#### Using PowerShell:
```powershell
npm install pkg --save-dev
npm run build
npm run create-exe
```

#### Manual pkg command:
```bash
npx pkg launcher.js --targets node18-win-x64 --output ZwiftWorkoutMatcher.exe
```

### Troubleshooting:

#### If you get "pkg not found":
```bash
npm install -g pkg
pkg launcher.js --targets node18-win-x64 --output ZwiftWorkoutMatcher.exe
```

#### If you get build errors:
1. Make sure all dependencies are installed: `npm run install-all`
2. Try building the client first: `npm run build`
3. Check that Node.js version is compatible

#### If the executable doesn't work:
1. Make sure Node.js is installed on the target computer
2. Try running the batch file instead: `ZwiftWorkoutMatcher.bat`

## 📁 Files Created:
- `ZwiftWorkoutMatcher.exe` - The executable file (after running the commands above)
- `ZwiftWorkoutMatcher.bat` - Batch file alternative (works immediately)

## 🎮 How to Use:

### Using the Executable:
1. **Double-click `ZwiftWorkoutMatcher.exe`**
2. **Wait for it to start** (first time installs dependencies)
3. **Browser opens automatically** to `http://localhost:3000`
4. **Upload your ZWO files** and get route matches
5. **Close the command window** when done

### Using the Batch File:
1. **Double-click `ZwiftWorkoutMatcher.bat`**
2. **Same experience as the executable**

## 🔧 Advanced Options:

### Create a smaller executable:
```bash
pkg launcher.js --targets node18-win-x64 --output ZwiftWorkoutMatcher.exe --compress GZip
```

### Create for different platforms:
```bash
# Windows
pkg launcher.js --targets node18-win-x64 --output ZwiftWorkoutMatcher.exe

# macOS
pkg launcher.js --targets node18-macos-x64 --output ZwiftWorkoutMatcher

# Linux
pkg launcher.js --targets node18-linux-x64 --output ZwiftWorkoutMatcher
```

## 💡 Tips:
- The batch file (`ZwiftWorkoutMatcher.bat`) is often more reliable than the executable
- The executable requires Node.js to be installed on the target computer
- The batch file handles dependency installation automatically
- Both options provide the same user experience

## 🆘 Need Help?
If you have trouble creating the executable, just use the batch file - it works the same way! 