/**
 * Navbar Component
 * Navigation bar for the application
 */

import React from 'react';

const Navbar = ({ isLoggedIn, onLogout, sessionInfo }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">📄 Resume Screening System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn && sessionInfo && (
              <div className="text-sm">
                <span className="mr-2">Resumes: <strong>{sessionInfo.resumes_count}</strong></span>
                {sessionInfo.has_job_description && (
                  <span className="ml-2">Job Description: <strong>Loaded</strong></span>
                )}
              </div>
            )}
            
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
