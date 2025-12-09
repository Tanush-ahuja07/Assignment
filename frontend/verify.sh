#!/usr/bin/env bash
# Setup Verification Script for Linux/Mac

echo "=================================="
echo "  React + Vite Setup Verification"
echo "=================================="
echo ""

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Check current directory
echo ""
echo "Checking directory..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    echo "Please run this from the frontend directory"
    exit 1
fi

# Check node_modules
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "⚠️  node_modules not found, installing..."
    npm install --legacy-peer-deps
fi

# Check src directory
echo "Checking source files..."
if [ -d "src" ]; then
    echo "✅ src/ directory found"
else
    echo "❌ src/ directory not found"
    exit 1
fi

# Check vite config
if [ -f "vite.config.ts" ]; then
    echo "✅ vite.config.ts found"
else
    echo "❌ vite.config.ts not found"
    exit 1
fi

# Check .env
if [ -f ".env" ]; then
    echo "✅ .env found"
else
    echo "⚠️  .env not found, creating from example..."
    cp .env.example .env
fi

echo ""
echo "=================================="
echo "  ✅ All checks passed!"
echo "=================================="
echo ""
echo "Run 'npm run dev' to start development server"
echo ""
