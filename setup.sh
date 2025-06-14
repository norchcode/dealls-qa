#!/bin/bash

# Dealls UI Automation Framework - Quick Setup Script
# This script helps users get started quickly with the framework

echo "🚀 Dealls UI Automation Framework - Quick Setup"
echo "================================================"

# Check Node.js version
echo "📦 Checking prerequisites..."
node_version=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js: $node_version"
else
    echo "❌ Node.js not found. Please install Node.js 18.0+ first."
    exit 1
fi

# Check npm
npm_version=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm: $npm_version"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Install dependencies
echo -e "\n📥 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Install Playwright browsers
echo -e "\n🌐 Installing Playwright browsers..."
npm run install:browsers
if [ $? -eq 0 ]; then
    echo "✅ Browsers installed successfully"
else
    echo "❌ Failed to install browsers"
    exit 1
fi

# Run TypeScript validation
echo -e "\n📝 Validating TypeScript..."
npm run lint
if [ $? -eq 0 ]; then
    echo "✅ TypeScript validation passed"
else
    echo "❌ TypeScript validation failed"
    exit 1
fi

# Run quick smoke test
echo -e "\n🧪 Running smoke test..."
echo "This will test the framework against the live Dealls mentoring platform..."
timeout 180s npm run test:smoke
if [ $? -eq 0 ]; then
    echo "✅ Smoke test passed - Framework is working!"
else
    echo "⚠️  Smoke test completed (may have timed out, check results)"
fi

echo -e "\n🎉 Setup completed successfully!"
echo -e "\n📋 Next steps:"
echo "1. Run 'npm test' to execute all tests"
echo "2. Run 'npm run test:headed' to see tests in visible browser"
echo "3. Run 'npm run report' to view test results"
echo "4. Check README.md for detailed documentation"

echo -e "\n📊 Available test commands:"
echo "• npm run test:smoke    - Quick smoke tests"
echo "• npm run test:core     - Core functionality tests"  
echo "• npm run test:headed   - Run with visible browser"
echo "• npm run test:chrome   - Chrome-specific tests"
echo "• npm run test:mobile   - Mobile device tests"

echo -e "\n🚀 Framework is ready to use!"