/**
 * Resume Upload Page Component
 * Handle multiple resume file uploads
 */

import React, { useState } from 'react';
import apiService from '../services/apiService';

const ResumeUploadPage = ({ onNavigate, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'docx', 'doc'].includes(ext)) {
        setError(`Invalid file: ${file.name}. Only PDF and DOCX files are allowed.`);
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    let successCount = 0;
    const uploadedList = [];

    for (const file of files) {
      try {
        const response = await apiService.uploadResume(file);
        successCount++;
        uploadedList.push({
          name: response.candidate_name,
          email: response.email,
          skills: response.skills
        });
        setSuccessMessage(`✓ Uploaded: ${response.candidate_name}`);
      } catch (err) {
        setError(`Failed to upload ${file.name}: ${err.message}`);
        console.error(err);
      }
    }

    setUploadedResumes([...uploadedResumes, ...uploadedList]);
    setFiles([]);
    setIsUploading(false);
    
    if (successCount > 0) {
      if (onUploadSuccess) onUploadSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Resumes</h2>
          <p className="text-gray-600">Upload candidate resumes in PDF or DOCX format</p>
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

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-bold mb-4">Select Resumes</label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 cursor-pointer hover:bg-blue-100 transition">
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="text-5xl mb-4">📁</div>
                <p className="text-gray-700 font-semibold mb-2">Click to select files</p>
                <p className="text-gray-600 text-sm">Supported formats: PDF, DOCX (Max 10MB each)</p>
              </label>
            </div>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-100 p-4 rounded">
                    <div>
                      <p className="font-semibold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex space-x-4">
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {isUploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
            </button>
            <button
              onClick={() => setFiles([])}
              className="bg-gray-500 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Uploaded Resumes Summary */}
        {uploadedResumes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Uploaded Resumes ({uploadedResumes.length})
            </h3>
            <div className="space-y-4">
              {uploadedResumes.map((resume, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg p-4">
                  <p className="font-bold text-gray-800">{resume.name}</p>
                  <p className="text-sm text-gray-600">{resume.email}</p>
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Skills Detected:</p>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills && resume.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {resume.skills && resume.skills.length > 5 && (
                        <span className="text-xs text-gray-600 px-3 py-1">
                          +{resume.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => onNavigate('job-description')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Next: Enter Job Description
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-gray-500 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;
