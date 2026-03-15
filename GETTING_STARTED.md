# AI Resume Screening System - Getting Started Guide

## ⚡ Quick Start (5 minutes)

### For Windows Users:
```bash
# 1. Open Command Prompt in project root
cd ai-resume-screening-system

# 2. Run the setup script
setup.bat

# 3. In Terminal 1:
cd backend
venv\Scripts\activate.bat
python app.py

# 4. In Terminal 2:
cd frontend
npm start
```

### For macOS/Linux Users:
```bash
# 1. Navigate to project
cd ai-resume-screening-system

# 2. Make setup script executable
chmod +x setup.sh

# 3. Run the setup script
./setup.sh

# 4. In Terminal 1:
cd backend
source venv/bin/activate
python app.py

# 5. In Terminal 2:
cd frontend
npm start
```

---

## 📋 System Requirements

- **Python:** 3.8 or higher
- **Node.js:** 14.0 or higher
- **npm:** 6.0 or higher
- **RAM:** Minimum 4GB (8GB recommended for model downloads)
- **Storage:** 2GB minimum (3GB+ for models)
- **OS:** Windows, macOS, or Linux

---

## 🔍 Project Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                   running on port 3000                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                    Axios (HTTP)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   REST API (Flask)                           │
│                  running on port 5000                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Resume     │  │   Skill      │  │   Similarity     │  │
│  │   Parser     │  │   Extractor  │  │   Model (NLP)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│        ↓                   ↓                    ↓            │
│  Extract Text,      Identify Skills,    TF-IDF + BERT      │
│  Candidate Info     Job Requirements    Matching Score      │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
App (Main Component)
├── Navbar (Navigation)
├── LoginPage (Authentication)
└── Routes (Page Navigation)
    ├── DashboardPage (Overview)
    ├── ResumeUploadPage (File Upload)
    ├── JobDescriptionPage (Job Input)
    └── AnalysisPage (Results)
    
Services Layer:
└── apiService.js (Backend Communication)
```

### Backend Architecture

```
app.py (Flask Application)
├── Routes
│   ├── POST /api/upload_resume
│   ├── POST /api/add_job_description
│   ├── POST /api/analyze
│   ├── GET /api/results
│   └── GET /api/session-info
│
├── Modules
│   ├── resume_parser.py
│   │   ├── Extract text from PDF/DOCX
│   │   └── Parse candidate information
│   │
│   ├── skill_extractor.py
│   │   ├── Extract technical skills
│   │   └── Identify certifications
│   │
│   ├── similarity_model.py
│   │   ├── TF-IDF vectorization
│   │   ├── Sentence Transformer embeddings
│   │   └── Cosine similarity calculation
│   │
│   └── utils.py
│       ├── Text cleaning
│       ├── Email/Phone extraction
│       └── Helper functions
│
└── Session Storage (In-memory)
    ├── Uploaded resumes
    ├── Job description
    └── Analysis results
```

---

## 🧪 Usage Workflow

### Step 1: Login
1. Open http://localhost:3000
2. Enter any email and password (demo mode)
3. Click Login

### Step 2: Upload Resumes
1. Click "Upload Resumes" on dashboard
2. Select PDF or DOCX files
3. System automatically extracts:
   - Candidate name, email, phone
   - Education and experience
   - Technical skills

### Step 3: Enter Job Description
1. Click "Job Description"
2. Paste or load sample job description
3. System extracts required keywords and skills

### Step 4: Run Analysis
1. Click "Analyze"
2. System calculates match scores for all resumes
3. Generates ranked candidate list

### Step 5: View Results
1. See ranked candidates with match percentages
2. Click candidate to view detailed information
3. Export or take notes for hiring decisions

---

## 🔧 Configuration Files

### Backend Configuration
**File:** `backend/.env`

```env
FLASK_ENV=development          # development or production
FLASK_DEBUG=True              # Enable debug mode
FLASK_APP=app.py              # Main app file
API_HOST=0.0.0.0              # API host address
API_PORT=5000                 # API port number
MAX_FILE_SIZE=10485760        # 10MB max file size
UPLOAD_FOLDER=uploads         # Resume storage location
```

### Frontend Configuration
**File:** `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## 📦 Dependencies Overview

### Frontend Dependencies
- **react** - UI framework
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **react-router-dom** - Client-side routing

### Backend Dependencies
- **Flask** - Web framework
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction
- **scikit-learn** - TF-IDF vectorization
- **sentence-transformers** - BERT embeddings
- **nltk** - NLP preprocessing
- **pandas** - Data manipulation
- **numpy** - Numerical computing

---

## 🚀 API Testing

### Using cURL

**1. Health Check:**
```bash
curl http://localhost:5000/api/health
```

**2. Upload Resume:**
```bash
curl -F "file=@resume.pdf" http://localhost:5000/api/upload_resume
```

**3. Add Job Description:**
```bash
curl -X POST http://localhost:5000/api/add_job_description \
  -H "Content-Type: application/json" \
  -d '{"job_description":"Senior Full Stack Developer required with 5+ years experience"}'
```

**4. Run Analysis:**
```bash
curl -X POST http://localhost:5000/api/analyze
```

**5. Get Results:**
```bash
curl http://localhost:5000/api/results?limit=10&offset=0
```

---

## 📊 Understanding Match Scores

### Match Percentage Breakdown

| Range | Level | Interpretation |
|-------|-------|-----------------|
| 80-100% | ⭐⭐⭐⭐⭐ Excellent | Perfect fit, all key requirements met |
| 60-79% | ⭐⭐⭐⭐ Good | Strong match, most requirements met |
| 40-59% | ⭐⭐⭐ Moderate | Fair match, some key skills missing |
| 20-39% | ⭐⭐ Fair | Limited match, major gaps |
| 0-19% | ⭐ Poor | Not suitable for position |

### How Scores Are Calculated

1. **TF-IDF Component** (40%) - Keyword matching
   - Extracts important terms from both texts
   - Calculates similarity based on keyword overlap
   - Fast and reliable for exact matches

2. **Semantic Component** (60%) - Meaning-based matching
   - Uses BERT neural networks
   - Understands context and meaning
   - Better for non-exact matches

3. **Combined Score** = (Semantic × 0.6) + (TF-IDF × 0.4)

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: NLTK data not found

**Error:** `LookupError: **Resource punkt not found**`

**Solution:**
```bash
python -c "import nltk; nltk.download('all')"
```

### Issue: Frontend can't connect to backend

**Error:** `Failed to fetch` or network errors

**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify `REACT_APP_API_URL` in `.env`
3. Check firewall settings
4. Try disabling CORS temporarily for debugging

### Issue: Build fails on Vercel

**Solution:**
```bash
# Clear cache
npm ci
npm run build

# Or in Vercel settings:
# Add build command: npm ci && npm run build
```

---

## 📚 File Upload Specifications

### Supported Formats
- PDF (.pdf)
- Word Document (.docx, .doc)

### File Size Limits
- Maximum: 10MB per file
- Recommended: < 5MB for better performance

### Resume Content
The system extracts:
- ✅ Name (from first line/header)
- ✅ Email addresses
- ✅ Phone numbers
- ✅ Education history
- ✅ Work experience
- ✅ Technical skills
- ✅ Certifications

---

## 🎯 Optimization Tips

### For Large Number of Resumes

1. **Batch Processing:**
   - Process resumes in groups of 10-20
   - Reset session between batches if needed

2. **Caching:**
   - Cache embedding vectors (FVE)
   - Reuse job description analysis

3. **Database Migration:**
   - Switch from in-memory to PostgreSQL
   - Implement proper indexing

### Performance Tuning

```python
# In similarity_model.py
# Reduce max_features for faster processing
TfidfVectorizer(max_features=200)  # instead of 500

# Reduce top_n skills returned
extract_skills(text, top_n=10)  # instead of 20
```

---

## 📈 Project Evaluation Criteria

This project demonstrates:

✅ **Full-Stack Development** (React + Flask)  
✅ **Database Concepts** (Ready for migration)  
✅ **API Design** (RESTful principles)  
✅ **Frontend Design** (Responsive, modern UI)  
✅ **NLP Implementation** (TF-IDF + BERT)  
✅ **File Processing** (PDF + DOCX)  
✅ **Error Handling** (Comprehensive)  
✅ **Code Quality** (Clean, documented)  
✅ **Deployment Ready** (Vercel compatible)  
✅ **Security** (Input validation, sanitization)  

---

## 📝 Project Deliverables

### Code Files
- ✅ Frontend components (5 pages)
- ✅ Backend APIs (7 endpoints)
- ✅ NLP modules (3 modules)
- ✅ Configuration files
- ✅ Deployment setup

### Documentation
- ✅ README.md (Comprehensive)
- ✅ Sample data
- ✅ Example output
- ✅ Getting Started Guide
- ✅ API documentation

### Features
- ✅ User authentication
- ✅ File upload & processing
- ✅ Intelligent matching
- ✅ Result ranking
- ✅ Interactive dashboard

---

## 🎓 Learning Resources

### Python & NLP
- [NLTK Documentation](https://www.nltk.org/)
- [Scikit-learn Guide](https://scikit-learn.org/)
- [Sentence Transformers](https://www.sbert.net/)

### Web Development
- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Deployment
- [Vercel Docs](https://vercel.com/docs)
- [Flask Deployment](https://flask.palletsprojects.com/deployment/)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Set `FLASK_ENV=production`
- [ ] Generate secure `SECRET_KEY`
- [ ] Configure database (PostgreSQL recommended)
- [ ] Set up proper authentication
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up logging and monitoring
- [ ] Test all API endpoints
- [ ] Optimize frontend build
- [ ] Set environment variables securely
- [ ] Test file upload with various formats
- [ ] Verify PDF and DOCX parsing
- [ ] Test with multiple concurrent users
- [ ] Set up automated backups
- [ ] Document API for team

---

## 🤝 Support & Help

- Check README.md for detailed documentation
- Review SAMPLE_DATA.md for examples
- See EXAMPLE_OUTPUT.md for expected results
- Check API errors in browser console
- Review Flask logs for backend errors
- Test APIs with the provided cURL commands

---

**Ready to get started?** Run the setup script and follow the Quick Start section above!

Good luck with your project! 🚀
