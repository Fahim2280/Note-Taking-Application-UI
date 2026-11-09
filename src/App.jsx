import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthView from './components/AuthView';
import NotesView from './components/NotesView';
import PostsView from './components/PostsView';
import InterestsView from './components/InterestsView';
import AdminView from './components/AdminView';
import './App.css';

export default function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('notes');
  const [selectedLookupUserId, setSelectedLookupUserId] = useState('');

  const handleSelectUserForLookup = (userId) => {
    setSelectedLookupUserId(userId);
    setActiveTab('posts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return (
      <div className="app-layout">
        <Navbar activeTab="" onSelectTab={() => {}} />
        <main className="main-content">
          <AuthView />
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
      />

      <main className="main-content">
        {activeTab === 'notes' && <NotesView />}

        {activeTab === 'posts' && (
          <PostsView prefilledUserId={selectedLookupUserId} />
        )}

        {activeTab === 'interests' && (
          <InterestsView onSelectUserForLookup={handleSelectUserForLookup} />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminView onSelectUserForLookup={handleSelectUserForLookup} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Secure Note-Taking & Posts Client &bull; Connected to live REST API &bull; Zero External UI Frameworks
        </p>
      </footer>
    </div>
  );
}
