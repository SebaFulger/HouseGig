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
    const token = localStorage.getItem('authToken');
    if (token) {
      api.setToken(token);
      // Try to fetch user data
      api.getMe()
        .then(userData => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('authToken');
          api.setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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

  // Test login function for quick testing
  const loginAsTestUser = () => {
    const testUser = {
      id: 'test-user-1',
      username: 'TestUser',
      email: 'test@example.com',
      avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'This is a test user for development'
    };
    setUser(testUser);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'test-token-123');
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
    loginAsTestUser,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
