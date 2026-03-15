/**
 * Main App Component
 * Manages routing and state for the entire application
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import JobDescriptionPage from './pages/JobDescriptionPage';
import AnalysisPage from './pages/AnalysisPage';
import apiService from './services/apiService';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [sessionInfo, setSessionInfo] = useState(null);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Refresh session info periodically
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(refreshSessionInfo, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const checkBackendConnection = async () => {
    try {
      await apiService.healthCheck();
      console.log('Backend connection successful');
    } catch (error) {
      console.error('Backend connection failed:', error);
      // Show warning but allow app to continue
    }
  };

  const refreshSessionInfo = async () => {
    try {
      const data = await apiService.getSessionInfo();
      setSessionInfo(data.data || data);
    } catch (error) {
      console.error('Failed to refresh session info:', error);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    refreshSessionInfo();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage('login');
    setSessionInfo(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleUploadSuccess = () => {
    refreshSessionInfo();
  };

  const handleJobDescriptionAdded = () => {
    refreshSessionInfo();
  };

  // Render appropriate page based on current state
  const renderPage = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage user={currentUser} onNavigate={handleNavigate} />;
      case 'resume-upload':
        return <ResumeUploadPage onNavigate={handleNavigate} onUploadSuccess={handleUploadSuccess} />;
      case 'job-description':
        return <JobDescriptionPage onNavigate={handleNavigate} onJobDescriptionAdded={handleJobDescriptionAdded} />;
      case 'analyze':
      case 'results':
        return <AnalysisPage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage user={currentUser} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      {isLoggedIn && (
        <Navbar 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          sessionInfo={sessionInfo}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;
