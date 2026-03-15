@echo off
REM Setup script for AI Resume Screening System on Windows

echo.
echo ========================================
echo AI Resume Screening System - Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Python and Node.js are installed.
echo.

REM Setup Backend
echo Setting up Backend...
echo.
cd backend

REM Create virtual environment
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Download NLTK data
echo Downloading NLTK data...
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

REM Download Sentence Transformer model
echo Downloading Sentence Transformer model...
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

echo Backend setup complete!
echo.

REM Setup Frontend
echo Setting up Frontend...
echo.
cd ..\frontend

REM Install npm dependencies
echo Installing npm dependencies...
call npm install

REM Create .env file
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Created .env file. Update REACT_APP_API_URL if needed.
)

echo Frontend setup complete!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Open two terminal windows
echo.
echo 2. Terminal 1 (Backend):
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python app.py
echo.
echo 3. Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
pause
