# 🔧 Browser Setup Guide: Headless vs Visible Testing

## 🎯 Current Environment Detection

The framework **automatically detects your environment**:

- **Docker/CI Environment**: Runs in **headless mode** (no browser window)
- **Local Machine**: Can run in **visible mode** (browser window opens)

## 📋 Environment Configuration

### **Current Environment: Docker Container**
✅ **Headless Mode**: `true` (automatically detected)
✅ **SlowMo**: `0` (faster execution)
✅ **Screenshots**: Captured on failures
✅ **Videos**: Recorded on failures
✅ **Traces**: Available for debugging

### **🖥️ To Run on Local Machine (Visible Browser)**

If you want to see the browser in action, **download and run locally**:

```bash
# 1. Extract framework to your local machine
# 2. Install dependencies
npm install

# 3. Install browsers
npm run install:browsers

# 4. Run with visible browser
npm run test:visible

# 5. Or run specific browser visible
npm run test:chrome:visible
```

## 🚀 Available Commands

### **Headless Testing (Current Environment)**
```bash
# Run all tests (headless in Docker)
npm test

# Explicitly headless
npm run test:headless

# Specific browser headless
npm run test:chrome:headless
```

### **Visible Testing (Local Machine Only)**
```bash
# Run with visible browser (local machine)
npm run test:visible

# Chrome with visible browser
npm run test:chrome:visible

# Debug mode (always visible)
npm run test:debug
```

### **Development & Debugging**
```bash
# Interactive UI mode
npm run test:ui

# Debug specific test
npm run test:debug

# Run single test
npm run test:single "should load mentoring page"
```

## 🐳 Docker Environment Limitations

In Docker containers (like this environment):

❌ **Cannot run visible browsers** (no display server)
✅ **Headless mode works perfectly**
✅ **All functionality preserved**
✅ **Screenshots and videos captured**
✅ **Full test execution available**

## 🔧 Force Headless/Visible Mode

### **Force Headless** (any environment):
```bash
HEADLESS=true npm test
```

### **Force Visible** (local machine only):
```bash
HEADLESS=false npm run test:visible
```

## 📊 Test Artifacts (Both Modes)

Whether headless or visible, you get:

- ✅ **Screenshots** on test failures
- ✅ **Video recordings** of test sessions
- ✅ **Trace files** for step-by-step debugging
- ✅ **HTML reports** with visual evidence
- ✅ **JSON/XML reports** for CI integration

## 🎯 Recommendations

### **For Development:**
- **Local Machine**: Use visible mode (`npm run test:visible`)
- **Docker/CI**: Use headless mode (automatic)

### **For CI/CD:**
- Always use headless mode (automatic detection)
- Leverage screenshots and videos for debugging

### **For Debugging:**
- Use `npm run test:debug` for step-by-step debugging
- Use `npm run test:ui` for interactive test development