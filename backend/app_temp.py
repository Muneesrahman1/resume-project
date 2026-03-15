"""
AI Resume Screening System - Flask Backend
Main application file with REST API endpoints
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename
from resume_parser import ResumeParser
from skill_extractor import SkillExtractor
from similarity_model import SimilarityModel
from utils import allowed_file, clean_text

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize modules
parser = ResumeParser()
skill_extractor = SkillExtractor()
similarity_model = SimilarityModel()

# In-memory storage for session data (in production, use database)
session_data = {
    'resumes': {},
    'job_description': None,
    'job_keywords': [],
    'results': []
}


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'success',
        'message': 'AI Resume Screening System Backend is running',
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/upload_resume', methods=['POST'])
def upload_resume():
    """
    Upload resume file and extract information
    
    Expected: multipart/form-data with 'file' field
    Returns: Extracted resume data
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        
        file = request.files['file']
        
        # Check if filename is empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Check if file extension is allowed
        if not allowed_file(file.filename, ALLOWED_EXTENSIONS):
            return jsonify({
                'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse resume
        resume_data = parser.parse_resume(filepath)
        
        # Extract skills
        resume_data['skills'] = skill_extractor.extract_skills(
            resume_data.get('text', '')
        )
        
        # Store in session
        resume_id = filename.replace('.pdf', '').replace('.docx', '').replace('.doc', '')
        session_data['resumes'][resume_id] = {
            'filename': filename,
            'filepath': filepath,
            'data': resume_data,
            'uploaded_at': datetime.now().isoformat()
        }
        
        return jsonify({
            'status': 'success',
            'message': 'Resume uploaded and parsed successfully',
            'resume_id': resume_id,
            'candidate_name': resume_data.get('name', 'Unknown'),
            'email': resume_data.get('email', 'N/A'),
            'phone': resume_data.get('phone', 'N/A'),
            'skills_found': len(resume_data['skills']),
            'skills': resume_data['skills'][:10]  # Return top 10 skills
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error processing resume: {str(e)}'
        }), 500


@app.route('/api/add_job_description', methods=['POST'])
def add_job_description():
    """
    Add job description and extract keywords
    
    Expected JSON: {'job_description': 'text...'}
    Returns: Extracted keywords
    """
    try:
        data = request.get_json()
        
        if not data or 'job_description' not in data:
            return jsonify({'error': 'job_description field is required'}), 400
        
        job_description = data['job_description'].strip()
        
        if not job_description:
            return jsonify({'error': 'job_description cannot be empty'}), 400
        
        # Store job description
        session_data['job_description'] = job_description
        
        # Extract keywords
        keywords = skill_extractor.extract_skills(job_description)
        session_data['job_keywords'] = keywords
        
        return jsonify({
            'status': 'success',
            'message': 'Job description added successfully',
            'keywords_found': len(keywords),
            'keywords': keywords[:15]  # Return top 15 keywords
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error processing job description: {str(e)}'
        }), 500


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Analyze all resumes against job description
    Calculate similarity scores
    
    Returns: Ranked candidates with match scores
    """
    try:
        # Check if job description is provided
        if not session_data['job_description']:
            return jsonify({
                'error': 'Please add a job description first'
            }), 400
        
        # Check if resumes are uploaded
        if not session_data['resumes']:
            return jsonify({
                'error': 'Please upload at least one resume'
            }), 400
        
        results = []
        
        # Calculate similarity for each resume
        for resume_id, resume_info in session_data['resumes'].items():
            resume_text = resume_info['data'].get('text', '')
            
            # Calculate similarity score
            similarity_score = similarity_model.calculate_similarity(
                resume_text,
                session_data['job_description']
            )
            
            # Calculate match percentage (0-100)
            match_percentage = round(similarity_score * 100, 2)
            
            # Extract key info
            candidate_data = {
                'resume_id': resume_id,
                'candidate_name': resume_info['data'].get('name', 'Unknown'),
                'email': resume_info['data'].get('email', 'N/A'),
                'phone': resume_info['data'].get('phone', 'N/A'),
                'match_percentage': match_percentage,
                'similarity_score': round(similarity_score, 4),
                'skills': resume_info['data'].get('skills', [])[:10],
                'education': resume_info['data'].get('education', 'N/A'),
                'experience_summary': resume_info['data'].get('experience_summary', 'N/A')
            }
            
            results.append(candidate_data)
        
        # Sort by match percentage (descending)
        results.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        # Store results
        session_data['results'] = results
        
        return jsonify({
            'status': 'success',
            'message': 'Analysis completed successfully',
            'total_candidates': len(results),
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error analyzing resumes: {str(e)}'
        }), 500


@app.route('/api/results', methods=['GET'])
def get_results():
    """
    Get analysis results
    Optionally filter by resume_id
    
    Query parameters: ?resume_id=id&limit=10&offset=0
    Returns: Ranked candidates
    """
    try:
        if not session_data['results']:
            return jsonify({
                'status': 'success',
                'message': 'No analysis results available',
                'results': []
            }), 200
        
        results = session_data['results'].copy()
        
        # Filter by resume_id if provided
        resume_id = request.args.get('resume_id')
        if resume_id:
            results = [r for r in results if r['resume_id'] == resume_id]
        
        # Apply pagination
        limit = int(request.args.get('limit', 10))
        offset = int(request.args.get('offset', 0))
        
        total = len(results)
        results = results[offset:offset + limit]
        
        return jsonify({
            'status': 'success',
            'total': total,
            'offset': offset,
            'limit': limit,
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error retrieving results: {str(e)}'
        }), 500


@app.route('/api/resume/<resume_id>', methods=['GET'])
def get_resume_details(resume_id):
    """
    Get detailed information for a specific resume
    
    Returns: Full resume data
    """
    try:
        if resume_id not in session_data['resumes']:
            return jsonify({'error': 'Resume not found'}), 404
        
        resume_info = session_data['resumes'][resume_id]
        
        return jsonify({
            'status': 'success',
            'resume_id': resume_id,
            'filename': resume_info['filename'],
            'uploaded_at': resume_info['uploaded_at'],
            'data': resume_info['data']
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error retrieving resume: {str(e)}'
        }), 500


@app.route('/api/reset', methods=['POST'])
def reset_session():
    """
    Reset all session data (clear uploads, results, etc.)
    """
    try:
        # Clear session data
        session_data['resumes'] = {}
        session_data['job_description'] = None
        session_data['job_keywords'] = []
        session_data['results'] = []
        
        return jsonify({
            'status': 'success',
            'message': 'Session reset successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error resetting session: {str(e)}'
        }), 500


@app.route('/api/session-info', methods=['GET'])
def get_session_info():
    """
