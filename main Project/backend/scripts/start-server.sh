#!/bin/bash

# Kill any existing server processes
echo "Stopping any existing server processes..."
pkill -f "node.*server.js" 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Check if port is free
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 8000 is still in use. Please manually stop the process using port 8000."
    exit 1
fi

echo "Starting server..."
npm run dev 