/**
 * Job Description Page Component
 * Input job description for analysis
 */

import React, { useState } from 'react';
import apiService from '../services/apiService';

const JobDescriptionPage = ({ onNavigate, onJobDescriptionAdded }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [submittedJobDescription, setSubmittedJobDescription] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const sampleJobDescription = `
Senior Full Stack Developer

We are looking for an experienced Full Stack Developer to join our growing team. 

Requirements:
- 5+ years of experience with JavaScript/React
- Strong backend experience with Python/Flask or Node.js
- Database design and optimization (SQL, MongoDB)
- RESTful API development
- Cloud deployment (AWS, Azure, or GCP)
- DevOps and containerization (Docker, Kubernetes)
- Git version control
- Problem-solving and communication skills

Nice to have:
- Machine Learning experience
- TypeScript knowledge
- CI/CD pipeline experience
- Microservices architecture knowledge
- Agile/Scrum methodology

Responsibilities:
- Develop and maintain scalable web applications
- Design and implement RESTful APIs
- Optimize database queries
- Deploy applications to cloud platforms
- Collaborate with team members and stakeholders
- Code reviews and mentoring junior developers
`;

  const handleLoadSample = () => {
    setJobDescription(sampleJobDescription.trim());
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiService.addJobDescription(jobDescription);
      setSubmittedJobDescription(jobDescription);
      setKeywords(response.keywords || []);
      setSuccessMessage(`✓ Job description added successfully! ${response.keywords_found} keywords extracted.`);
      if (onJobDescriptionAdded) onJobDescriptionAdded();
    } catch (err) {
      setError(`Failed to process job description: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Job Description</h2>
          <p className="text-gray-600">Enter job requirements for matching against resumes</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Description Input */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Enter Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here... or load a sample."
                className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !jobDescription.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  {isSubmitting ? 'Processing...' : 'Submit Job Description'}
                </button>
                <button
                  onClick={handleLoadSample}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Load Sample
                </button>
                <button
                  onClick={() => setJobDescription('')}
                  className="bg-gray-500 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Keywords Display */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Extracted Keywords</h3>
              {keywords.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Found <strong>{keywords.length}</strong> keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {keywords.slice(0, 20).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {keywords.length > 20 && (
                    <p className="text-xs text-gray-600 mt-2">
                      ... and {keywords.length - 20} more keywords
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  Submit a job description to extract keywords
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submitted Job Description Display */}
        {submittedJobDescription && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Current Job Description</h3>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✓ Active
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
              {submittedJobDescription}
            </p>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => onNavigate('analyze')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Next: Run Analysis
              </button>
              <button
                onClick={() => onNavigate('resume-upload')}
                className="bg-gray-500 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Back to Resume Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionPage;
