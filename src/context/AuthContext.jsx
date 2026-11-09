import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const safeStorage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch (e) {
      console.warn('localStorage read error:', e);
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, val);
    } catch (e) {
      console.warn('localStorage write error:', e);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage remove error:', e);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = safeStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return safeStorage.getItem('token') || null;
  });

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    safeStorage.setItem('token', newToken);
    safeStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    safeStorage.removeItem('token');
    safeStorage.removeItem('user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      safeStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'Admin',
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
