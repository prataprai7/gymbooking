#!/bin/bash

echo "🧪 Running BayamBook API Tests"
echo "================================"

# Check if Jest is installed
if ! command -v npx jest &> /dev/null; then
    echo "❌ Jest not found. Installing dependencies..."
    npm install
fi

echo "📋 Running Unit Tests..."
npm run test:unit

echo ""
echo "🔗 Running Integration Tests..."
npm run test:integration

echo ""
echo "📊 Running Coverage Report..."
npm run test:coverage

echo ""
echo "✅ All tests completed!" 