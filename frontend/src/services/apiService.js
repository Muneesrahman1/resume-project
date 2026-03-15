/**
 * API Service Module
 * Handles all API calls to the Flask backend
 */

import axios from 'axios';

// API base URL - configure based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API Service object with all endpoints
export const apiService = {
  /**
   * Health check endpoint
   */
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  /**
   * Upload resume file
   * @param {File} file - Resume file (PDF or DOCX)
   * @returns {Promise} Upload response with parsed resume data
   */
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/api/upload_resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    }
  },

  /**
   * Add job description
   * @param {string} jobDescription - Job description text
   * @returns {Promise} Response with extracted keywords
   */
  addJobDescription: async (jobDescription) => {
    try {
      const response = await apiClient.post('/api/add_job_description', {
        job_description: jobDescription
      });
      return response.data;
    } catch (error) {
      console.error('Job description error:', error);
      throw error;
    }
  },

  /**
   * Analyze resumes against job description
   * @returns {Promise} Analysis results with ranked candidates
   */
  analyze: async () => {
    try {
      const response = await apiClient.post('/api/analyze');
      return response.data;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  },

  /**
   * Get analysis results
   * @param {Object} params - Query parameters (resume_id, limit, offset)
   * @returns {Promise} Results data
   */
  getResults: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/results', { params });
      return response.data;
    } catch (error) {
      console.error('Get results error:', error);
      throw error;
    }
  },

  /**
   * Get details for specific resume
   * @param {string} resumeId - Resume ID
   * @returns {Promise} Resume details
   */
  getResumeDetails: async (resumeId) => {
    try {
      const response = await apiClient.get(`/api/resume/${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Get resume details error:', error);
      throw error;
    }
  },

  /**
   * Get session information
   * @returns {Promise} Current session data
   */
  getSessionInfo: async () => {
    try {
      const response = await apiClient.get('/api/session-info');
      return response.data;
    } catch (error) {
      console.error('Get session info error:', error);
      throw error;
    }
  },

  /**
   * Reset session (clear all data)
   * @returns {Promise} Reset response
   */
  resetSession: async () => {
    try {
      const response = await apiClient.post('/api/reset');
      return response.data;
    } catch (error) {
      console.error('Reset session error:', error);
      throw error;
    }
  }
};

export default apiService;
