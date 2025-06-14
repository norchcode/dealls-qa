#!/bin/bash

# Script Validation for Dealls Playwright Framework
# This script tests all npm scripts to ensure they work correctly

echo "🔧 Testing all npm scripts for Playwright framework..."
echo "=================================================="

# Test basic Playwright installation
echo "📦 Checking Playwright installation..."
npx playwright --version
if [ $? -eq 0 ]; then
    echo "✅ Playwright installed correctly"
else
    echo "❌ Playwright installation issue"
    exit 1
fi

# Test TypeScript compilation
echo -e "\n📝 Testing TypeScript compilation..."
npm run lint
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
fi

# Test individual commands (dry run where possible)
echo -e "\n🧪 Testing individual npm scripts..."

# Test help command to validate CLI options
echo "🔍 Validating Playwright CLI options..."
npx playwright test --help > /tmp/playwright-help.txt 2>&1

if grep -q "\-\-headed" /tmp/playwright-help.txt; then
    echo "✅ --headed option is valid"
else
    echo "❌ --headed option not found"
fi

if grep -q "\-\-headed=false" /tmp/playwright-help.txt; then
    echo "❌ --headed=false is incorrectly documented"
else
    echo "✅ --headed=false is not documented (correct - this syntax is invalid)"
fi

# Test configuration loading
echo -e "\n⚙️  Testing configuration loading..."
npx playwright test --list > /tmp/test-list.txt 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Configuration loads successfully"
    echo "📊 Test count: $(grep -c "\.spec\.ts" /tmp/test-list.txt) test files found"
else
    echo "❌ Configuration loading failed"
    cat /tmp/test-list.txt
fi

# Test specific scripts that should work without executing full tests
echo -e "\n🚀 Testing script commands..."

# Test version command
echo "Checking version script..."
npm run version 2>&1 | head -1
if [ $? -eq 0 ]; then
    echo "✅ Version script works"
else
    echo "❌ Version script failed"
fi

# Test clean script
echo "Testing clean script..."
npm run clean
if [ $? -eq 0 ]; then
    echo "✅ Clean script works"
else
    echo "❌ Clean script failed"
fi

# Test configuration validation
echo -e "\n🔧 Testing configuration files..."

# Test main config
npx playwright test --config=playwright.config.ts --list > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Main config (playwright.config.ts) is valid"
else
    echo "❌ Main config has issues"
fi

# Test local config
npx playwright test --config=playwright.local.config.ts --list > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Local config (playwright.local.config.ts) is valid"
else
    echo "❌ Local config has issues"
fi

# Test project configurations
echo -e "\n🌐 Testing browser project configurations..."

for project in chromium firefox webkit mobile-chrome mobile-safari tablet; do
    npx playwright test --project=$project --list > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Project '$project' is valid"
    else
        echo "❌ Project '$project' has issues"
    fi
done

# Summary of correct CLI usage
echo -e "\n📋 CORRECT PLAYWRIGHT CLI USAGE:"
echo "======================================="
echo "✅ Headless mode (default): npx playwright test"
echo "✅ Headed mode (visible):   npx playwright test --headed"
echo "❌ INVALID:                npx playwright test --headed=false"
echo "❌ INVALID:                npx playwright test --headless=true"
echo ""
echo "📝 Configuration options:"
echo "✅ headless: true   (in config file)"
echo "✅ headless: false  (in config file)" 
echo "✅ --headed         (CLI flag)"
echo "✅ --config         (CLI flag)"
echo "✅ --project        (CLI flag)"

echo -e "\n🎉 Script validation completed!"

# Cleanup
rm -f /tmp/playwright-help.txt /tmp/test-list.txt