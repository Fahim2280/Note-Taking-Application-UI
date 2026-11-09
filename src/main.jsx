import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', padding: '24px', border: '1px solid #fecaca', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#991b1b' }}>
          <h2>Application Initialization Error</h2>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            style={{ marginTop: '16px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px' }}
            onClick={() => {
              try { window.localStorage.clear(); } catch {}
              window.location.reload();
            }}
          >
            Clear Storage & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
