import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        api.setToken(token);
        try {
          // Try to fetch user data
          const userData = await api.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          // Token invalid, clear it
          localStorage.removeItem('authToken');
          api.setToken(null);
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (email, password, username) => {
    const data = await api.register(email, password, username);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const requireAuth = (onUnauthenticated) => {
    if (!isAuthenticated) {
      if (onUnauthenticated) {
        onUnauthenticated();
      }
      return false;
    }
    return true;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
