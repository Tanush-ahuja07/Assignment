#!/bin/bash
# Quick Backend Health Check Script

echo "🔍 Checking Backend Connectivity..."
echo ""

# Check if port 3000 is listening
echo "1️⃣  Checking if port 3000 is listening..."
if nc -zv localhost 3000 2>/dev/null; then
    echo "✅ Port 3000 is open"
else
    echo "❌ Port 3000 is NOT responding"
    echo "   → Start backend: cd backend && npm start"
    exit 1
fi

echo ""

# Test API endpoint
echo "2️⃣  Testing /events endpoint..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/events)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Backend is responding (HTTP 200)"
    curl -s http://localhost:3000/events | head -c 100
    echo ""
else
    echo "❌ Backend returned HTTP $RESPONSE"
fi

echo ""

# Check database
echo "3️⃣  Checking database connection..."
if mysql -h localhost -u root -pTanushahuja1234@ gravit -e "SELECT COUNT(*) FROM users;" 2>/dev/null; then
    echo "✅ Database is connected"
else
    echo "❌ Database connection failed"
    echo "   → Run: mysql -u root -p Tanushahuja1234@ < schema.sql"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To fully start the system:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
