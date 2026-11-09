import React, { useState } from 'react';
import { loginApi, registerApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

export default function AuthView() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInterests, setRegInterests] = useState('');
  const [regRole, setRegRole] = useState('User');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await loginApi({
        email: loginEmail.trim(),
        password: loginPassword
      });

      const { token, user } = response.data;
      login(token, user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Parse comma-separated interests into array of strings
    const parsedInterests = regInterests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    try {
      const response = await registerApi({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        interests: parsedInterests
      });

      const { token, user } = response.data;
      setSuccess('Account created successfully! Logging you in...');
      setTimeout(() => {
        login(token, user);
      }, 600);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Secure Note-Taking & Posts Portal</h2>
          <p className="text-muted">
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Create a new account (select User or Admin)'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
              setSuccess('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
              setSuccess('');
            }}
          >
            Create Account
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="form-group">
            <div className="form-field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="form-group">
            <div className="form-field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Alice Johnson"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="alice@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-password">Password (min 6 characters)</label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-interests">Interests (comma-separated)</label>
              <input
                id="reg-interests"
                type="text"
                placeholder="coding, ai, mongodb, cloud"
                value={regInterests}
                onChange={(e) => setRegInterests(e.target.value)}
              />
              <small className="help-text">e.g. "chess, reading" converts to ['chess', 'reading']</small>
            </div>

            <div className="form-field">
              <label htmlFor="reg-role">Role (for testing)</label>
              <select
                id="reg-role"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
              >
                <option value="User">User (Standard Access)</option>
                <option value="Admin">Admin (Full RBAC Access)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
