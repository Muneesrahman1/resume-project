"""
Utility functions for the AI Resume Screening System
"""

import re
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')


def allowed_file(filename, allowed_extensions):
    """
    Check if file extension is allowed
    
    Args:
        filename (str): Original filename
        allowed_extensions (set/list): Set of allowed extensions
    
    Returns:
        bool: True if file is allowed, False otherwise
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions


def clean_text(text):
    """
    Clean and preprocess text
    
    Args:
        text (str): Raw text to clean
    
    Returns:
        str: Cleaned text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text


def remove_stopwords(text):
    """
    Remove stopwords from text
    
    Args:
        text (str): Text to process
    
    Returns:
        list: List of tokens without stopwords
    """
    stop_words = set(stopwords.words('english'))
    
    # Tokenize
    tokens = word_tokenize(text.lower())
    
    # Remove stopwords
    filtered_tokens = [token for token in tokens if token not in stop_words and len(token) > 2]
    
    return filtered_tokens


def extract_email(text):
    """
    Extract email address from text
    
    Args:
        text (str): Text to search
    
    Returns:
        str: Email address or None
    """
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None


def extract_phone(text):
    """
    Extract phone number from text
    
    Args:
        text (str): Text to search
    
    Returns:
        str: Phone number or None
    """
    # Pattern for various phone formats
    patterns = [
        r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\d{10}',
        r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None


def normalize_text(text):
    """
    Normalize text for comparison
    
    Args:
        text (str): Text to normalize
    
    Returns:
        str: Normalized text
    """
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Convert to lowercase
    text = text.lower()
    
    return text


def extract_name_from_text(text):
    """
    Extract potential candidate name from text
    Typically appears at the beginning of resume
    
    Args:
        text (str): Resume text
    
    Returns:
        str: Extracted name or None
    """
    lines = text.strip().split('\n')
    
    # First non-empty line is usually the name
    for line in lines:
        line = line.strip()
        if line and len(line) < 100:  # Name should be relatively short
            # Remove special characters but keep basic name structure
            cleaned = re.sub(r'[^a-zA-Z\s\-.]', '', line)
            if len(cleaned.split()) >= 1:
                return cleaned.strip()
    
    return None


def calculate_reading_time(text, wpm=200):
    """
    Estimate reading time for text
    
    Args:
        text (str): Text to estimate
        wpm (int): Words per minute (default 200)
    
    Returns:
        int: Estimated time in minutes
    """
    word_count = len(text.split())
    return max(1, round(word_count / wpm))


def get_text_statistics(text):
    """
    Get statistics about text
    
    Args:
        text (str): Text to analyze
    
    Returns:
        dict: Text statistics
    """
    words = text.split()
    
    return {
        'character_count': len(text),
        'word_count': len(words),
        'sentence_count': len(re.split(r'[.!?]+', text)),
        'average_word_length': round(len(text) / len(words) if words else 0, 2)
    }
