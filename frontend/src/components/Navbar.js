import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ totalCount, completedCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✅</span>
        <span className="navbar-title">TaskUs</span>
      </div>

      <div className="navbar-stats">
        <div className="stat-pill">
          <span className="stat-num">{totalCount}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-pill stat-pill--green">
          <span className="stat-num">{completedCount}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>

      <div className="navbar-user">
        <div className="user-avatar">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="user-name">{user?.username}</span>
        <button className="logout-btn" onClick={handleLogout} title="Sign out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
