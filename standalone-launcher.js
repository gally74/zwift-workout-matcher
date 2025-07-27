const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('🚴 Zwift Workout Route Matcher');
console.log('=====================================');

// Check if we're running from a bundled executable
const isBundled = process.pkg !== undefined;

if (isBundled) {
    console.log('✅ Running from bundled executable');
} else {
    console.log('ℹ️ Running from development environment');
}

// Check if Node.js is available
function checkNodeJS() {
    return new Promise((resolve) => {
        exec('node --version', (error, stdout) => {
            if (error) {
                console.log('⚠️ Node.js not found in PATH, using bundled version');
                resolve(false);
            } else {
                console.log(`✅ Node.js found: ${stdout.trim()}`);
                resolve(true);
            }
        });
    });
}

// Start the application
async function startApp() {
    try {
        const hasNodeJS = await checkNodeJS();
        
        console.log('🚀 Starting Zwift Workout Route Matcher...');
        console.log('');
        console.log('The app will open in your browser at: http://localhost:3000');
        console.log('');
        console.log('Press Ctrl+C to stop the application when you\'re done.');
        console.log('');
        
        // Start the server
        const server = spawn('node', ['server/index.js'], {
            stdio: 'inherit',
            shell: true
        });
        
        // Wait a moment for server to start, then open browser
        setTimeout(() => {
            console.log('🌐 Opening browser...');
            exec('start http://localhost:3000');
        }, 3000);
        
        server.on('close', (code) => {
            console.log('');
            console.log('Application stopped.');
            console.log('Press any key to exit...');
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', process.exit.bind(process, 0));
        });
        
    } catch (error) {
        console.error('❌ Error starting application:', error.message);
        console.log('');
        console.log('Press any key to exit...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
    }
}

startApp(); 