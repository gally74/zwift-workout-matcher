#!/bin/bash

echo "🚴 Setting up Zwift Workout Route Matcher..."

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "This will start both the server (port 5000) and client (port 3000)"
echo "Open http://localhost:3000 in your browser" 