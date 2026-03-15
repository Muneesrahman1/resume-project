/**
 * Analysis Results Page Component
 * Display ranked candidates with match scores
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AnalysisPage = ({ onNavigate }) => {
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiService.analyze();
      setResults(response.results || []);
      setSuccessMessage(`✓ Analysis completed! ${response.total_candidates} candidates ranked.`);
    } catch (err) {
      setError(`Failed to run analysis: ${err.message}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getResults();
      setResults(response.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 border-green-300';
    if (percentage >= 60) return 'bg-blue-100 border-blue-300';
    if (percentage >= 40) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getMatchLevel = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Moderate';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Analysis Results</h2>
          <p className="text-gray-600">Ranked candidates based on resume-job description match</p>
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

        {/* Analysis Button */}
        {results.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <p className="text-gray-600 mb-6 text-lg">
              No analysis results yet. Click below to analyze uploaded resumes against the job description.
            </p>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-10 py-4 rounded-lg font-semibold text-lg transition"
            >
              {isAnalyzing ? 'Running Analysis...' : '🚀 Run Analysis'}
            </button>
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Candidates</p>
                <p className="text-4xl font-bold text-blue-600">{results.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Top Match</p>
                <p className={`text-3xl font-bold ${getMatchColor(results[0]?.match_percentage || 0)}`}>
                  {results[0]?.match_percentage || 0}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Average Match</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(results.reduce((sum, r) => sum + r.match_percentage, 0) / results.length).toFixed(1)}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">Excellent Matches</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.filter(r => r.match_percentage >= 80).length}
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="mb-8 text-right">
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                {isAnalyzing ? 'Analyzing...' : 'Refresh Results'}
              </button>
            </div>
          </>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((candidate, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition border-l-4 border-blue-600`}
                onClick={() => setSelectedCandidate(selectedCandidate?.resume_id === candidate.resume_id ? null : candidate)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">#{idx + 1} {candidate.candidate_name}</h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        {candidate.phone && <p className="text-sm text-gray-600">{candidate.phone}</p>}
                      </div>
                    </div>

                    {/* Skills */}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Top Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 8).map((skill, i) => (
                            <span key={i} className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 8 && (
                            <span className="text-xs text-gray-600">+{candidate.skills.length - 8}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {candidate.experience_summary && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Experience:</strong> {candidate.experience_summary.substring(0, 100)}...
                      </div>
                    )}
                  </div>

                  {/* Match Score */}
                  <div className={`rounded-lg p-6 text-center ml-4 border ${getMatchBgColor(candidate.match_percentage)}`}>
                    <div className={`text-4xl font-bold ${getMatchColor(candidate.match_percentage)}`}>
                      {candidate.match_percentage}%
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mt-2">
                      {getMatchLevel(candidate.match_percentage)} Match
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Score: {candidate.similarity_score}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedCandidate?.resume_id === candidate.resume_id && (
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3">Education</h4>
                        <p className="text-sm text-gray-700">{candidate.education || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3">All Detected Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills && candidate.skills.map((skill, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && !isAnalyzing && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Make sure you have:</p>
            <ul className="text-gray-700 mb-6 space-y-2">
              <li>✓ Uploaded at least one resume</li>
              <li>✓ Added a job description</li>
              <li>✓ Run the analysis</li>
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-gray-500 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => onNavigate('resume-upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Upload More Resumes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
