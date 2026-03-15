# AI Resume Screening System

A comprehensive, production-ready AI-powered resume screening system that automatically analyzes and ranks candidate resumes against job descriptions using Natural Language Processing (NLP).

## 🎯 Project Overview

This is a complete full-stack application designed as a final-year computer science project. It demonstrates:
- **Modern Web Development:** React.js for responsive UI, Flask for powerful backend
- **Machine Learning:** NLP techniques for intelligent resume matching
- **Cloud-Ready:** Optimized for Vercel deployment (frontend) and compatible with serverless backends
- **Professional Code:** Clean, well-documented, production-grade code

### Key Features

✅ **User Authentication** - Simple login system for HR/Admin users  
✅ **Resume Upload** - Support for PDF and DOCX file formats  
✅ **Intelligent Parsing** - Extract candidate information (name, email, phone, skills, education, experience)  
✅ **NLP-Based Matching** - Compare resumes with job descriptions using TF-IDF and Sentence Transformers  
✅ **Candidate Ranking** - Automatic ranking based on similarity scores  
✅ **Modern Dashboard** - Interactive interface with real-time statistics  
✅ **Responsive Design** - Mobile-friendly interface using Tailwind CSS  
✅ **RESTful APIs** - Well-documented backend APIs  

## 📋 Project Structure

```
ai-resume-screening-system/
├── frontend/                    # React.js Application
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js       # Navigation bar component
│   │   ├── pages/
│   │   │   ├── LoginPage.js        # Login interface
│   │   │   ├── DashboardPage.js    # Main dashboard
│   │   │   ├── ResumeUploadPage.js # Resume upload
│   │   │   ├── JobDescriptionPage.js # Job description input
│   │   │   └── AnalysisPage.js      # Results display
│   │   ├── services/
│   │   │   └── apiService.js       # API integration
│   │   ├── App.js              # Main app component
│   │   ├── App.css             # App styles
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── package.json            # NPM dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── vercel.json             # Vercel deployment config
│   └── .env.example            # Environment variables template
│
├── backend/                     # Flask API
│   ├── app.py                  # Main Flask application
│   ├── resume_parser.py        # Resume parsing logic
│   ├── skill_extractor.py      # Skill extraction from text
│   ├── similarity_model.py     # NLP similarity calculations
│   ├── utils.py                # Utility functions
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variables template
│
├── uploads/                     # Resume storage (local development)
├── vercel.json                 # Root Vercel configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── SAMPLE_DATA.md             # Sample job descriptions and resumes
├── EXAMPLE_OUTPUT.md          # Example system output
└── PROJECT_GUIDE.md           # Detailed project guide (optional)
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 14+** and npm
- **Git**

### Backend Setup

1. **Clone the repository:**
```bash
cd ai-resume-screening-system/backend
```

2. **Create a Python virtual environment:**
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Download NLP models (required):**
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

5. **Run the Flask server:**
```bash
python app.py
```

The backend will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install NPM dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

Update `.env` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000
```

4. **Start the development server:**
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration (.env)

```env
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=app.py
API_HOST=0.0.0.0
API_PORT=5000
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=uploads
```

### Frontend Configuration (.env)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Check if the backend is running.

### Upload Resume
```
POST /api/upload_resume
```
Upload a resume file (PDF or DOCX)

**Request:** multipart/form-data with file field  
**Response:**
```json
{
  "status": "success",
  "resume_id": "timestamp_filename",
  "candidate_name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "skills_found": 10,
  "skills": ["Python", "React", "Flask", ...]
}
```

### Add Job Description
```
POST /api/add_job_description
```

**Request:**
```json
{
  "job_description": "Job description text here..."
}
```

**Response:**
```json
{
  "status": "success",
  "keywords_found": 15,
  "keywords": ["Python", "React", "AWS", ...]
}
```

### Run Analysis
```
POST /api/analyze
```
Analyze all resumes against the job description.

**Response:**
```json
{
  "status": "success",
  "total_candidates": 3,
  "results": [
    {
      "resume_id": "id",
      "candidate_name": "John Doe",
      "match_percentage": 85.5,
      "similarity_score": 0.855,
      "skills": [...],
      "education": "...",
      "experience_summary": "..."
    }
  ]
}
```

### Get Results
```
GET /api/results?limit=10&offset=0
```
Get ranked analysis results with pagination.

### Get Resume Details
```
GET /api/resume/{resume_id}
```
Get detailed information for a specific resume.

### Get Session Info
```
GET /api/session-info
```
Get current session statistics.

### Reset Session
```
POST /api/reset
```
Clear all uploaded data and results.

## 🎨 Frontend Features

### Login Page
- Mock authentication (enter any email and password)
- Clean, modern UI with gradient background
- Demo credentials provided

### Dashboard
- Overview of uploaded resumes and job description status
- Quick access to all major features
- Real-time statistics
- Session data summary

### Resume Upload
- Drag-and-drop or click-to-select file upload
- Multiple file upload support
- File validation (PDF/DOCX only)
- Display of extracted candidate information

### Job Description
- Text area for job description input
- Load sample job description
- Real-time keyword extraction display
- Extracted keywords shown as tags

### Analysis & Results
- Ranked candidates with match percentages
- Color-coded match levels (Excellent/Good/Moderate/Poor)
- Detailed candidate information expandable cards
- Summary statistics (total candidates, average match, etc.)
- Top skills and experience summary

## 🤖 NLP & Matching Algorithm

The system uses a hybrid approach for resume-job description matching:

### 1. **TF-IDF Vectorization**
- Converts text to numerical vectors using term frequency
- Calculates cosine similarity between documents
- Fast and efficient for bag-of-words matching

### 2. **Sentence Transformers**
- Uses pre-trained BERT-based models for semantic understanding
- Captures meaning beyond keyword matching
- More accurate for complex comparisons

### 3. **Hybrid Scoring**
- Combines both methods: 60% Sentence Transformer + 40% TF-IDF
- Balances semantic understanding with keyword matching
- Match percentage displayed as 0-100

### 4. **Skill Extraction**
- Matches resume skills against 100+ predefined technical skills
- Pattern recognition for skill variations
- Importance-weighted skill identification

## 📦 Required Python Libraries

```
Flask==2.3.3                    # Web framework
Flask-CORS==4.0.0              # Handle cross-origin requests
pandas==2.0.3                  # Data manipulation
numpy==1.24.3                  # Numerical computing
scikit-learn==1.3.0            # Machine learning (TF-IDF)
nltk==3.8.1                    # Natural language processing
spacy==3.6.1                   # Advanced NLP
PyPDF2==3.0.1                  # PDF processing
python-docx==0.8.11            # DOCX processing
sentence-transformers==2.2.2   # Semantic similarity
joblib==1.3.1                  # Model persistence
```

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Build the React app:**
```bash
cd frontend
npm run build
```

2. **Connect to Vercel:**
```bash
npm install -g vercel
vercel
```

3. **Set environment variables in Vercel dashboard:**
   - `REACT_APP_API_URL` → Your Flask API URL

### Deploy Backend Options

#### Option 1: Railway
```bash
pip install railway
railway init
railway deploy
```

#### Option 2: Heroku
```bash
heroku create your-app-name
git push heroku main
```

#### Option 3: AWS Lambda
Use AWS SAM or Zappa for serverless deployment.

#### Option 4: Google Cloud Run
```bash
gcloud run deploy your-service --source .
```

### Production Considerations

1. **Use a proper database** (PostgreSQL, MongoDB) instead of in-memory storage
2. **Add user authentication** (JWT tokens, OAuth)
3. **Implement rate limiting**
4. **Add file upload validation**
5. **Use environment variables for secrets**
6. **Enable HTTPS/SSL**
7. **Set up proper logging and monitoring**
8. **Cache similarity scores**
9. **Implement result pagination**

## 🧪 Testing

### Test the API
```bash
# Test health check
curl http://localhost:5000/api/health

# Test with sample resume upload (requires actual file)
curl -F "file=@resume.pdf" http://localhost:5000/api/upload_resume

# Test job description
curl -X POST http://localhost:5000/api/add_job_description \
  -H "Content-Type: application/json" \
  -d '{"job_description":"Your job description here"}'
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Sample Data

See `SAMPLE_DATA.md` for:
- Sample job descriptions
- Sample candidate resumes (3 different levels)
- Skills examples

## 📈 Example Output

See `EXAMPLE_OUTPUT.md` for:
- Complete API responses
- Example analysis results
- Match statistics and analysis
- Ranking visualization

## 🐛 Troubleshooting

### Backend Issues

**Error: ModuleNotFoundError**
```bash
# Ensure all dependencies are installed
pip install -r requirements.txt
```

**Error: NLTK data not found**
```bash
python -c "import nltk; nltk.download('all')"
```

**CORS Error**
- Ensure Flask-CORS is installed
- Check that frontend URL is in CORS allowed origins
- Add to `app.py`: `CORS(app, resources={r"/api/*": {"origins": "*"}})`

### Frontend Issues

**Error: Cannot find module 'axios'**
```bash
npm install axios
```

**Backend connection refused**
- Check if Flask server is running on port 5000
- Verify `REACT_APP_API_URL` in .env file
- Check firewall settings

**Build error on Vercel**
```bash
# Clear cache and rebuild
npm ci
npm run build
```

## 📚 Project Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [Scikit-learn TF-IDF](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting)
- [Sentence Transformers](https://www.sbert.net/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Documentation](https://vercel.com/docs)

## 📝 Code Guidelines

- **Clean Code:** Well-documented with comments
- **Error Handling:** Comprehensive try-catch and error responses
- **Security:** Input validation, file type checking
- **Performance:** Optimized queries, caching strategies
- **Scalability:** Modular architecture ready for database integration

## 🔐 Security Features

- File type validation (.pdf, .docx only)
- File size limits (10MB max)
- CORS enabled for specific origins
- Input sanitization
- Error messages that don't expose sensitive data
- Environment variables for configuration

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Developed as a final-year Computer Science project demonstrating:
- Full-stack web development
- Machine learning and NLP
- Cloud deployment
- Professional software engineering practices

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the sample data and example output
3. Check API documentation in this README
4. Review code comments in source files

## ✨ Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] Advanced user roles (Admin, HR, Hiring Manager)
- [ ] Batch processing for large numbers of resumes
- [ ] Custom scoring weights
- [ ] Email notifications
- [ ] Export results to CSV/PDF
- [ ] Resume templates and formatting analysis
- [ ] Automated interview scheduling
- [ ] Integration with HRIS systems
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app version

## 🎓 Learning Outcomes

This project teaches:
- Full-stack development (React + Flask)
- Natural Language Processing fundamentals
- Machine Learning model evaluation
- REST API design
- Cloud deployment strategies
- Database design (future)
- DevOps practices

---

**Happy coding!** 🚀

For more information, see SAMPLE_DATA.md and EXAMPLE_OUTPUT.md
