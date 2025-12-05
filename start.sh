#!/bin/bash
# Start a local web server to avoid CORS issues with canvas image processing
echo "Starting Santa Run..."
echo "Opening http://localhost:8000 in your browser..."

# Open the browser after a brief delay to ensure server is up
(sleep 1 && open "http://localhost:8000") &

# Start Python HTTP server
python3 -m http.server 8000
