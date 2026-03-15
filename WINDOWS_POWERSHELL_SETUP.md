# Windows PowerShell Setup Guide

## 🚀 Step-by-Step Setup for Windows PowerShell

### Step 1: Backend Setup

```powershell
# Navigate to backend folder
cd C:\Users\ELCOT\Documents\resume_Project\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (PowerShell syntax)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install Flask==2.3.3 Flask-CORS==4.0.0 pandas==2.0.3 numpy==1.24.3
pip install scikit-learn==1.3.0 nltk==3.8.1 spacy==3.6.1
pip install PyPDF2==3.0.1 python-docx==0.8.11
pip install sentence-transformers==2.2.2 joblib==1.3.1 Werkzeug==2.3.7

# Download required NLP models
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Download Sentence Transformer model (this may take 2-3 minutes)
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Run the Flask server
python app.py
```

**Expected output when running:**
```
WARNING in app.run(): This is a development server. Do not use it in production deployments. Use a production WSGI server instead.
 * Running on http://0.0.0.0:5000
```

---

### Step 2: Frontend Setup (In a NEW PowerShell window)

```powershell
# Navigate to frontend folder
cd C:\Users\ELCOT\Documents\resume_Project\frontend

# Install npm dependencies
npm install

# Create .env file if it doesn't exist
if (!(Test-Path .env)) { Copy-Item .env.example .env }

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view resume-screening-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

---

## ✅ When Everything is Running

- Backend: http://localhost:5000/api/health (should show green message)
- Frontend: http://localhost:3000 (should show login page)

---

## 🐛 Troubleshooting PowerShell Issues

### Issue: "cannot be loaded because running scripts is disabled"

**Solution:** Run this command once in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Virtual environment won't activate

**Try this command:**
```powershell
& "C:\Users\ELCOT\Documents\resume_Project\backend\venv\Scripts\Activate.ps1"
```

### Issue: Flask module not found after activation

**Make sure prompt shows (venv):**
```
(venv) PS C:\Users\ELCOT\Documents\resume_Project\backend>
```

If not, try:
```powershell
.\venv\Scripts\Activate.ps1
```

### Issue: npm install failing

**Try clearing cache:**
```powershell
npm cache clean --force
rm -Force node_modules -Recurse
npm install
```

---

## 💡 Quick Command Reference

| Task | Command |
|------|---------|
| Activate venv | `.\venv\Scripts\Activate.ps1` |
| Deactivate venv | `deactivate` |
| Install packages | `pip install package-name` |
| Start backend | `python app.py` |
| Start frontend | `npm start` |
| Build frontend | `npm run build` |

---

## ⚡ Full Setup in One Go (Copy & Paste)

Open PowerShell and run this entire block:

```powershell
# Setup Backend
cd C:\Users\ELCOT\Documents\resume_Project\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install Flask==2.3.3 Flask-CORS==4.0.0 pandas==2.0.3 numpy==1.24.3 scikit-learn==1.3.0 nltk==3.8.1 spacy==3.6.1 PyPDF2==3.0.1 python-docx==0.8.11 sentence-transformers==2.2.2 joblib==1.3.1 Werkzeug==2.3.7

# Download models
Write-Host "Downloading NLTK data..." -ForegroundColor Green
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
Write-Host "Downloading Sentence Transformer model..." -ForegroundColor Green
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

Write-Host "Backend setup complete!" -ForegroundColor Green
Write-Host "To start backend: python app.py" -ForegroundColor Yellow
```

---

## 🎯 Final Steps

1. **Terminal 1** (Backend):
   ```powershell
   cd C:\Users\ELCOT\Documents\resume_Project\backend
   .\venv\Scripts\Activate.ps1
   python app.py
   ```

2. **Terminal 2** (Frontend):
   ```powershell
   cd C:\Users\ELCOT\Documents\resume_Project\frontend
   npm install
   npm start
   ```

3. **Open browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

---

## 📝 Notes

- Keep both terminal windows open while working
- Backend needs ~30 seconds to fully start (downloading models)
- Frontend will auto-compile on file changes
- Press Ctrl+C to stop either server

---

**You're all set! Happy coding!** 🚀
