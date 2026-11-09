import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, onSelectTab }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-logo">&#128221;</span>
          <span className="brand-title">Secure Notes & Posts</span>
        </div>

        {user && (
          <div className="navbar-user">
            <span className="user-greeting">
              Hello, <strong>{user.name}</strong>
            </span>
            <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
              {user.role}
            </span>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {user && (
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'notes' ? 'tab-active' : ''}`}
            onClick={() => onSelectTab('notes')}
          >
            My Notes
          </button>
          <button
            className={`tab-btn ${activeTab === 'posts' ? 'tab-active' : ''}`}
            onClick={() => onSelectTab('posts')}
          >
            Posts & Scenario 2 ($lookup)
          </button>
          <button
            className={`tab-btn ${activeTab === 'interests' ? 'tab-active' : ''}`}
            onClick={() => onSelectTab('interests')}
          >
            Scenario 1 (Interests Grouping)
          </button>
          {isAdmin && (
            <button
              className={`tab-btn tab-admin ${activeTab === 'admin' ? 'tab-active' : ''}`}
              onClick={() => onSelectTab('admin')}
            >
              &#9881; Admin Panel
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
