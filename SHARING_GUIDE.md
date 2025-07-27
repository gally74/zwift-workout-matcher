# Sharing Your Zwift Workout Route Matcher

## 🚀 Creating a Shareable Package

### Option 1: Single Executable (Recommended)

#### Prerequisites:
- Node.js installed on your computer
- All project dependencies installed

#### Steps to Create the Executable:

1. **Open Command Prompt** (not PowerShell) in your project folder
2. **Install the packaging tool:**
   ```cmd
   npm install pkg --save-dev
   ```
3. **Build the client:**
   ```cmd
   npm run build
   ```
4. **Create the executable:**
   ```cmd
   npm run package
   ```

#### What You'll Get:
- `ZwiftWorkoutMatcher.exe` - A single executable file (50-100MB)
- Works on any Windows computer with Node.js installed

### Option 2: Portable Package

#### Create a complete package with:
1. The executable
2. Node.js installer
3. README instructions
4. Sample ZWO files

#### Steps:
1. Create the executable (see Option 1)
2. Download Node.js installer from https://nodejs.org/
3. Create a folder structure:
   ```
   ZwiftWorkoutMatcher/
   ├── ZwiftWorkoutMatcher.exe
   ├── node-installer.msi
   ├── README.txt
   └── sample-workouts/
       ├── recovery.zwo
       ├── threshold.zwo
       └── vo2max.zwo
   ```

### Option 3: Installer Package

#### Using NSIS or Inno Setup:
1. Create an installer that:
   - Installs Node.js if needed
   - Extracts the application
   - Creates desktop shortcuts
   - Sets up file associations

## 📦 Distribution Options

### For Technical Users:
- **Single .exe file** - They can handle setup requirements

### For Non-Technical Users:
- **Portable package** - Everything included
- **Installer package** - Professional installation

### For Maximum Compatibility:
- **Batch file + instructions** - Works on any Windows computer

## 🎯 Recommended Sharing Package

### Create this folder structure:
```
ZwiftWorkoutMatcher-Shared/
├── ZwiftWorkoutMatcher.exe
├── README.txt
├── INSTALL.txt
├── sample-workouts/
│   ├── recovery.zwo
│   ├── sweet-spot.zwo
│   ├── threshold.zwo
│   └── vo2max.zwo
└── screenshots/
    ├── main-interface.png
    ├── upload-zwo.png
    └── results.png
```

### README.txt Content:
```
Zwift Workout Route Matcher
==========================

AI-powered matching of Xert ZWO files with perfect Zwift routes.

REQUIREMENTS:
- Windows 10 or later
- Node.js (will be installed automatically if needed)

INSTALLATION:
1. Double-click ZwiftWorkoutMatcher.exe
2. Wait for the app to start (first time may take a few minutes)
3. Your browser will open automatically to http://localhost:3000

USAGE:
1. Upload your Xert ZWO file using the upload button
2. Or select a workout type from the quick selection
3. Click "Find Matching Routes" to get AI recommendations
4. Review the route matches with scores and reasoning

FEATURES:
- Upload and parse Xert ZWO files
- AI-powered route matching
- 60+ Zwift routes across all worlds
- Detailed analysis and scoring
- Filter by world and workout type

SUPPORT:
If you encounter issues:
1. Make sure Node.js is installed (https://nodejs.org/)
2. Try running as administrator
3. Check that ports 3000 and 5000 are not in use

SAMPLE WORKOUTS:
Try the sample ZWO files in the sample-workouts folder to test the app.
```

### INSTALL.txt Content:
```
Quick Installation Guide
========================

1. PREREQUISITES:
   - Windows 10 or later
   - Internet connection (for first run)

2. INSTALLATION:
   - Double-click ZwiftWorkoutMatcher.exe
   - The app will install dependencies automatically
   - No additional setup required

3. FIRST RUN:
   - First run may take 2-5 minutes
   - Dependencies will be downloaded and installed
   - Browser will open automatically when ready

4. SUBSEQUENT RUNS:
   - App starts in 10-30 seconds
   - Browser opens automatically

5. TROUBLESHOOTING:
   - If the app doesn't start, try running as administrator
   - If browser doesn't open, manually go to http://localhost:3000
   - If you get port errors, close other applications using ports 3000/5000
```

## 🌐 Online Distribution

### GitHub Releases:
1. Create a GitHub repository
2. Upload the executable to releases
3. Provide clear installation instructions

### File Sharing Services:
- Google Drive
- Dropbox
- OneDrive
- WeTransfer

### Professional Distribution:
- Create an installer using NSIS or Inno Setup
- Include automatic Node.js installation
- Add desktop shortcuts and start menu entries

## 🔧 Advanced Packaging

### Using Electron (Most Professional):
```bash
npm install electron electron-builder --save-dev
```

### Using pkg with compression:
```bash
pkg standalone-launcher.js --targets node18-win-x64 --output ZwiftWorkoutMatcher.exe --public --compress GZip
```

### Using nexe (Alternative):
```bash
npm install -g nexe
nexe standalone-launcher.js --target windows-x64-14.15.3
```

## 💡 Tips for Sharing

1. **Test on a clean computer** before sharing
2. **Include clear instructions** for non-technical users
3. **Provide sample files** to demonstrate functionality
4. **Create screenshots** showing the app in action
5. **Include troubleshooting guide** for common issues
6. **Version your releases** for updates

## 🎯 Final Recommendation

For sharing with others, create:
1. **Single executable** for technical users
2. **Portable package** for non-technical users
3. **Clear documentation** for both groups

The portable package with README and sample files is usually the best option for most users. 