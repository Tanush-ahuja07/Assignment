#!/bin/bash
# React + Vite Setup Checklist

echo "🚀 BookItNow- React + Vite Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing globally..."
    npm install -g pnpm
fi
echo "✅ pnpm version: $(pnpm -v)"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Make sure your backend is running on http://localhost:3000"
echo "   2. Update .env if your API is on a different URL"
echo "   3. Run 'pnpm dev' to start the development server"
echo ""
echo "For more information, see REACT_SETUP.md"
