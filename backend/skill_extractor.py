"""
Skill Extractor Module
Extracts technical and professional skills from text
"""

import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk


class SkillExtractor:
    """Extract skills from resume and job description text"""
    
    def __init__(self):
        """Initialize skill extractor with predefined skill databases"""
        # Common technical skills
        self.technical_skills = {
            # Programming Languages
            'python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift',
            'golang', 'rust', 'kotlin', 'scala', 'r', 'matlab', 'perl',
            
            # Web Technologies
            'html', 'css', 'react', 'angular', 'vue', 'nodejs', 'express',
            'django', 'flask', 'spring', 'asp.net', 'laravel', 'symfony',
            'webpack', 'babel', 'rest api', 'graphql',
            
            # Databases
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra',
            'elasticsearch', 'firebase', 'dynamodb', 'oracle', 'sqlite',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
            'ci/cd', 'terraform', 'ansible', 'git', 'gitlab', 'github',
            'bitbucket', 'heroku', 'netlify', 'vercel',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch',
            'scikit-learn', 'keras', 'pandas', 'numpy', 'matplotlib',
            'seaborn', 'nlp', 'computer vision', 'artificial intelligence',
            
            # Tools & Frameworks
            'git', 'jira', 'confluence', 'slack', 'trello', 'figma',
            'photoshop', 'illustrator', 'blender', 'unity', 'unreal',
            'jupyter', 'anaconda', 'vagrant', 'virtualbox',
            
            # Soft Skills
            'communication', 'leadership', 'teamwork', 'problem-solving',
            'project management', 'agile', 'scrum', 'kanban', 'waterfall',
        }
        
        # Common job titles and roles
        self.job_titles = {
            'developer', 'engineer', 'architect', 'analyst', 'manager',
            'lead', 'senior', 'junior', 'intern', 'consultant', 'specialist',
            'coordinator', 'administrator', 'scientist', 'researcher'
        }
        
        # Certifications
        self.certifications = {
            'aws certified', 'azure certified', 'certified kubernetes',
            'cissp', 'ccna', 'ccnp', 'pmp', 'itil', 'agile certified',
            'scrum master', 'oracle certified', 'java certified'
        }
        
        # Download NLTK data
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
    
    def extract_skills(self, text, top_n=20):
        """
        Extract skills from text
        
        Args:
            text (str): Text to extract skills from
            top_n (int): Number of top skills to return
        
        Returns:
            list: List of extracted skills
        """
        if not text:
            return []
        
        text_lower = text.lower()
        extracted_skills = set()
        
        # Extract technical skills
        for skill in self.technical_skills:
            # Use word boundaries to match exact skills
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                extracted_skills.add(skill)
        
        # Extract certifications
        for cert in self.certifications:
            pattern = r'\b' + re.escape(cert) + r'\b'
            if re.search(pattern, text_lower):
                extracted_skills.add(cert)
        
        # Extract custom skills (words that appear frequently and are not stopwords)
        custom_skills = self._extract_custom_skills(text_lower, extracted_skills)
        extracted_skills.update(custom_skills)
        
        # Convert to list and limit results
        skills_list = sorted(list(extracted_skills), key=lambda x: len(x), reverse=True)
        
        return skills_list[:top_n]
    
    def _extract_custom_skills(self, text, existing_skills, min_length=4):
        """
        Extract custom skills that might not be in predefined list
        
        Args:
            text (str): Lowercase text
            existing_skills (set): Already extracted skills
            min_length (int): Minimum length of skill word
        
        Returns:
            set: Set of custom skills
        """
        stop_words = set(stopwords.words('english'))
        
        # Find capitalized terms (often indicate proper nouns like frameworks)
        custom_skills = set()
        
        # Look for multi-word expressions
        words = text.split()
        
        # Single word skills
        for word in words:
            # Remove special characters
            cleaned = re.sub(r'[^a-z0-9\-]', '', word)
            
            if (len(cleaned) >= min_length and 
                cleaned not in stop_words and 
                cleaned not in existing_skills and
                not cleaned.isdigit()):
                # Check if it appears multiple times (indicating importance)
                count = text.count(cleaned)
                if count >= 2:
                    custom_skills.add(cleaned)
        
        return custom_skills
    
    def extract_keywords(self, text, top_n=20):
        """
        Extract important keywords from text
        
        Args:
            text (str): Text to extract keywords from
            top_n (int): Number of top keywords to return
        
        Returns:
            list: List of keywords
        """
        # This is an alias for extract_skills
        # In production, could use TF-IDF or other keyword extraction
        return self.extract_skills(text, top_n)
    
    def match_required_skills(self, resume_text, job_description_text):
        """
        Find which required skills from job description are present in resume
        
        Args:
            resume_text (str): Resume text
            job_description_text (str): Job description text
        
        Returns:
            dict: Matching skills analysis
        """
        job_skills = set(self.extract_skills(job_description_text))
        resume_skills = set(self.extract_skills(resume_text))
        
        # Find matching and missing skills
        matched_skills = job_skills.intersection(resume_skills)
        missing_skills = job_skills.difference(resume_skills)
        
        # Calculate match percentage
        match_percentage = (len(matched_skills) / len(job_skills) * 100) if job_skills else 0
        
        return {
            'required_skills': list(job_skills),
            'resume_skills': list(resume_skills),
            'matched_skills': list(matched_skills),
            'missing_skills': list(missing_skills),
            'match_percentage': round(match_percentage, 2),
            'matched_count': len(matched_skills),
            'required_count': len(job_skills)
        }
