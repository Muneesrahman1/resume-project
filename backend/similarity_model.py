"""
Similarity Model Module
Calculates similarity between resumes and job descriptions using NLP
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from utils import normalize_text
import joblib
import os

# Try to import sentence transformers (optional)
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMER_AVAILABLE = True
except ImportError:
    print("Warning: sentence-transformers not installed. Using TF-IDF only.")
    SENTENCE_TRANSFORMER_AVAILABLE = False
    SentenceTransformer = None


class SimilarityModel:
    """Calculate similarity between documents using multiple approaches"""
    
    def __init__(self):
        """Initialize similarity model"""
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=500,
            min_df=1,
            max_df=0.9,
            ngram_range=(1, 2),
            stop_words='english'
        )
        
        # Try to load pre-trained sentence transformer, fallback if not available
        self.sentence_transformer = None
        self.use_transformer = False
        
        if SENTENCE_TRANSFORMER_AVAILABLE:
            try:
                self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
                self.use_transformer = True
                print("Sentence Transformers model loaded successfully")
            except Exception as e:
                print(f"Warning: Could not load sentence-transformers model: {e}. Using TF-IDF only.")
                self.use_transformer = False
        
        self.model_cache = {}
    
    def calculate_similarity(self, resume_text, job_description_text, method='hybrid'):
        """
        Calculate similarity between resume and job description
        
        Args:
            resume_text (str): Resume text
            job_description_text (str): Job description text
            method (str): Method to use ('tfidf', 'transformer', or 'hybrid')
        
        Returns:
            float: Similarity score between 0 and 1
        """
        # Normalize texts
        resume_text = normalize_text(resume_text)
        job_description_text = normalize_text(job_description_text)
        
        if not resume_text or not job_description_text:
            return 0.0
        
        if method == 'tfidf':
            return self._calculate_tfidf_similarity(resume_text, job_description_text)
        elif method == 'transformer' and self.use_transformer:
            return self._calculate_transformer_similarity(resume_text, job_description_text)
        elif method == 'hybrid' and self.use_transformer:
            # Combine both methods
            tfidf_score = self._calculate_tfidf_similarity(resume_text, job_description_text)
            transformer_score = self._calculate_transformer_similarity(resume_text, job_description_text)
            # Weight: 60% transformer (more semantically aware), 40% TF-IDF
            return (transformer_score * 0.6) + (tfidf_score * 0.4)
        else:
            return self._calculate_tfidf_similarity(resume_text, job_description_text)
    
    def _calculate_tfidf_similarity(self, text1, text2):
        """
        Calculate similarity using TF-IDF and Cosine Similarity
        
        Args:
            text1 (str): First text
            text2 (str): Second text
        
        Returns:
            float: Similarity score
        """
        try:
            # Vectorize texts
            vectors = self.tfidf_vectorizer.fit_transform([text1, text2])
            
            # Calculate cosine similarity
            similarity_matrix = cosine_similarity(vectors)
            similarity_score = similarity_matrix[0][1]
            
            return float(similarity_score)
        except Exception as e:
            print(f"Error in TF-IDF similarity: {str(e)}")
            return 0.0
    
    def _calculate_transformer_similarity(self, text1, text2):
        """
        Calculate similarity using Sentence Transformers
        
        Args:
            text1 (str): First text
            text2 (str): Second text
        
        Returns:
            float: Similarity score
        """
        try:
            if not self.sentence_transformer:
                return 0.0
            
            # Generate embeddings
            embedding1 = self.sentence_transformer.encode(text1, convert_to_tensor=False)
            embedding2 = self.sentence_transformer.encode(text2, convert_to_tensor=False)
            
            # Calculate cosine similarity
            similarity_score = cosine_similarity(
                [embedding1],
                [embedding2]
            )[0][0]
            
            return float(similarity_score)
        except Exception as e:
            print(f"Error in transformer similarity: {str(e)}")
            return 0.0
    
    def calculate_similarity_detailed(self, resume_text, job_description_text):
        """
        Calculate detailed similarity analysis
        
        Args:
            resume_text (str): Resume text
            job_description_text (str): Job description text
        
        Returns:
            dict: Detailed similarity analysis
        """
        resume_text = normalize_text(resume_text)
        job_description_text = normalize_text(job_description_text)
        
        # Calculate different similarity scores
        tfidf_score = self._calculate_tfidf_similarity(resume_text, job_description_text)
        transformer_score = 0.0
        
        if self.use_transformer:
            transformer_score = self._calculate_transformer_similarity(resume_text, job_description_text)
        
        # Overall score (hybrid approach)
        if self.use_transformer:
            overall_score = (transformer_score * 0.6) + (tfidf_score * 0.4)
        else:
            overall_score = tfidf_score
        
        # Calculate match percentage
        match_percentage = round(overall_score * 100, 2)
        
        return {
            'overall_score': round(overall_score, 4),
            'tfidf_score': round(tfidf_score, 4),
            'transformer_score': round(transformer_score, 4) if self.use_transformer else 0.0,
            'match_percentage': match_percentage,
            'similarity_level': self._get_similarity_level(match_percentage)
        }
    
    def _get_similarity_level(self, percentage):
        """
        Get human-readable similarity level
        
        Args:
            percentage (float): Match percentage
        
        Returns:
            str: Similarity level
        """
        if percentage >= 80:
            return 'Excellent Match'
        elif percentage >= 60:
            return 'Good Match'
        elif percentage >= 40:
            return 'Moderate Match'
        elif percentage >= 20:
            return 'Fair Match'
        else:
            return 'Poor Match'
    
    def batch_similarity(self, resume_texts, job_description_text):
        """
        Calculate similarity for multiple resumes
        
        Args:
            resume_texts (list): List of resume texts
            job_description_text (str): Job description text
        
        Returns:
            list: List of similarity scores
        """
        results = []
        
        for resume_text in resume_texts:
            score = self.calculate_similarity(resume_text, job_description_text)
            results.append(score)
        
        return results
    
    def compare_resumes(self, resume1_text, resume2_text):
        """
        Compare two resumes
        
        Args:
            resume1_text (str): First resume text
            resume2_text (str): Second resume text
        
        Returns:
            dict: Comparison result
        """
        similarity_score = self.calculate_similarity(resume1_text, resume2_text)
        
        return {
            'similarity_score': round(similarity_score, 4),
            'match_percentage': round(similarity_score * 100, 2),
            'similarity_level': self._get_similarity_level(similarity_score * 100)
        }
    
    def save_model(self, filepath):
        """
        Save TF-IDF vectorizer to file
        
        Args:
            filepath (str): Path to save model
        """
        try:
            joblib.dump(self.tfidf_vectorizer, filepath)
            print(f"Model saved to {filepath}")
        except Exception as e:
            print(f"Error saving model: {str(e)}")
    
    def load_model(self, filepath):
        """
        Load TF-IDF vectorizer from file
        
        Args:
            filepath (str): Path to load model from
        """
        try:
            self.tfidf_vectorizer = joblib.load(filepath)
            print(f"Model loaded from {filepath}")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
