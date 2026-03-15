/**
 * Dashboard Page Component
 * Main dashboard showing overview and navigation
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const DashboardPage = ({ user, onNavigate }) => {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessionInfo();
  }, []);

  const fetchSessionInfo = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getSessionInfo();
      setSessionInfo(data.data || data);
    } catch (err) {
      setError('Failed to fetch session info');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      try {
        await apiService.resetSession();
        setSessionInfo({
          resumes_count: 0,
          has_job_description: false,
          job_keywords_count: 0,
          results_count: 0,
          uploaded_resumes: []
        });
      } catch (err) {
        setError('Failed to reset session');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-600">Resume Screening & Analysis Dashboard</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Statistics Cards */}
          {!isLoading && sessionInfo && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-semibold mb-2">Uploaded Resumes</div>
                <div className="text-4xl font-bold text-blue-600">{sessionInfo.resumes_count}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-semibold mb-2">Job Description</div>
                <div className="text-lg text-green-600 font-bold">
                  {sessionInfo.has_job_description ? '✓ Added' : '✗ Not Added'}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-semibold mb-2">Keywords Found</div>
                <div className="text-4xl font-bold text-purple-600">{sessionInfo.job_keywords_count}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-gray-600 text-sm font-semibold mb-2">Analysis Results</div>
                <div className="text-4xl font-bold text-green-600">{sessionInfo.results_count}</div>
              </div>
            </>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition"
               onClick={() => onNavigate('resume-upload')}>
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Resumes</h3>
            <p className="text-gray-600 mb-4">Upload candidate resumes in PDF or DOCX format</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Upload Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition"
               onClick={() => onNavigate('job-description')}>
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Job Description</h3>
            <p className="text-gray-600 mb-4">Enter the job description for analysis</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Enter Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition"
               onClick={() => onNavigate('analyze')}>
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analyze</h3>
            <p className="text-gray-600 mb-4">Run matching analysis and get ranked results</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    disabled={!sessionInfo || sessionInfo.resumes_count === 0 || !sessionInfo.has_job_description}>
              Analyze
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition"
               onClick={() => onNavigate('results')}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">View Results</h3>
            <p className="text-gray-600 mb-4">See ranked candidates with match scores</p>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    disabled={!sessionInfo || sessionInfo.results_count === 0}>
              View Results
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        {sessionInfo && sessionInfo.uploaded_resumes && sessionInfo.uploaded_resumes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recently Uploaded Resumes</h3>
            <ul className="space-y-2">
              {sessionInfo.uploaded_resumes.slice(0, 5).map((resume, idx) => (
                <li key={idx} className="text-gray-700 text-sm">
                  • {resume}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-right">
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
