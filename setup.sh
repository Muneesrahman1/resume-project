#!/bin/bash

# Setup script for AI Resume Screening System on macOS/Linux

echo ""
echo "========================================"
echo "AI Resume Screening System - Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Python and Node.js are installed."
echo ""

# Setup Backend
echo "Setting up Backend..."
echo ""
cd backend || exit 1

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Download NLTK data
echo "Downloading NLTK data..."
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Download Sentence Transformer model
echo "Downloading Sentence Transformer model..."
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

echo "Backend setup complete!"
echo ""

# Setup Frontend
echo "Setting up Frontend..."
echo ""
cd ../frontend || exit 1

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Create .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Created .env file. Update REACT_APP_API_URL if needed."
fi

echo "Frontend setup complete!"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Open two terminal windows"
echo ""
echo "2. Terminal 1 (Backend):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "3. Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo ""
