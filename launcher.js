const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('🚴 Zwift Workout Route Matcher Launcher');
console.log('=====================================');

// Check if Node.js is installed
function checkNodeJS() {
  return new Promise((resolve) => {
    const nodeCheck = spawn('node', ['--version'], { stdio: 'pipe' });
    nodeCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Node.js is installed');
        resolve(true);
      } else {
        console.log('❌ Node.js is not installed');
        resolve(false);
      }
    });
  });
}

// Check if dependencies are installed
function checkDependencies() {
  return fs.existsSync(path.join(__dirname, 'node_modules'));
}

// Install dependencies
function installDependencies() {
  return new Promise((resolve, reject) => {
    console.log('📦 Installing dependencies...');
    const install = spawn('npm', ['run', 'install-all'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully');
        resolve();
      } else {
        console.log('❌ Failed to install dependencies');
        reject(new Error('Installation failed'));
      }
    });
  });
}

// Start the application
function startApp() {
  console.log('🚀 Starting Zwift Workout Route Matcher...');
  console.log('');
  console.log('The app will open in your browser at: http://localhost:3000');
  console.log('');
  console.log('Press Ctrl+C to stop the application when you\'re done.');
  console.log('');
  
  const app = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  app.on('close', (code) => {
    console.log('');
    console.log('Application stopped.');
    console.log('Press any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  });
}

// Main function
async function main() {
  try {
    // Check Node.js
    const nodeInstalled = await checkNodeJS();
    if (!nodeInstalled) {
      console.log('');
      console.log('Please install Node.js from https://nodejs.org/');
      console.log('Download the "LTS" version and run the installer.');
      console.log('');
      console.log('Press any key to exit...');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', process.exit.bind(process, 1));
      return;
    }
    
    // Check dependencies
    if (!checkDependencies()) {
      console.log('📦 Dependencies not found, installing...');
      await installDependencies();
    } else {
      console.log('✅ Dependencies already installed');
    }
    
    // Start the app
    startApp();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('Press any key to exit...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 1));
  }
}

main(); 