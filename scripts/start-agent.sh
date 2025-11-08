#!/bin/bash

# Olivia AI Voice Assistant - Startup Script
# Starts the Python uAgent and provides environment setup

set -e

echo "================================"
echo "  Olivia AI Voice Assistant"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Copying from example.env..."
    cp example.env .env
    echo "⚠️  Please edit .env with your API keys before continuing"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3.10 or higher"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.10"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python $PYTHON_VERSION detected, but $REQUIRED_VERSION or higher is required"
    exit 1
fi

echo "✅ Python $PYTHON_VERSION detected"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r python/requirements.txt

echo ""
echo "🚀 Starting Olivia agent..."
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the agent
cd python
python olivia_agent.py
