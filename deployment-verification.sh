#!/bin/bash
# deployment-verification.sh
# Quick verification script for deployed site

echo "🚀 OMEGA Space Sustainability - Deployment Verification"
echo "=========================================================="
echo ""

# Set the URL (update with actual deployment URL)
BASE_URL="${1:-http://localhost:8000}"
echo "Testing URL: $BASE_URL"
echo ""

# Function to check HTTP status
check_url() {
  local url=$1
  local name=$2
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" = "200" ]; then
    echo "✅ $name - OK (200)"
  else
    echo "❌ $name - FAILED ($status)"
  fi
}

echo "📄 Checking HTML:"
check_url "$BASE_URL/" "Homepage"
check_url "$BASE_URL/space-sustainability.html" "Main HTML"

echo ""
echo "🎨 Checking CSS Files:"
check_url "$BASE_URL/assets/css/fonts.css" "fonts.css"
check_url "$BASE_URL/assets/css/main.css" "main.css"
check_url "$BASE_URL/assets/css/layout.css" "layout.css"
check_url "$BASE_URL/assets/css/components.css" "components.css"
check_url "$BASE_URL/assets/css/animations.css" "animations.css"

echo ""
echo "⚡ Checking JavaScript Files:"
check_url "$BASE_URL/assets/js/boot-animations.js" "boot-animations.js"
check_url "$BASE_URL/assets/js/app.js" "app.js"

echo ""
echo "🖼️  Checking Media Files:"
check_url "$BASE_URL/public/media/images/fielding.jpg" "fielding.jpg"
check_url "$BASE_URL/public/media/images/moriba.jpg" "moriba.jpg"
check_url "$BASE_URL/public/media/images/wozniak.jpg" "wozniak.jpg"
check_url "$BASE_URL/public/media/video/objects.mp4" "objects.mp4"

echo ""
echo "📋 Checking Cache Headers:"
echo ""
curl -s -I "$BASE_URL/assets/css/main.css" | grep -i "cache-control"
echo "   ^ Should show: max-age=31536000, immutable"
echo ""
curl -s -I "$BASE_URL/space-sustainability.html" | grep -i "cache-control"
echo "   ^ Should show: max-age=0, must-revalidate"

echo ""
echo "=========================================================="
echo "Verification complete!"
echo ""
echo "Manual checks:"
echo "1. Open $BASE_URL in browser"
echo "2. Check console for 'Locomotive Scroll initialized'"
echo "3. Test smooth scroll on desktop"
echo "4. Verify video plays"
echo "5. Check responsive layout on mobile"
echo ""
