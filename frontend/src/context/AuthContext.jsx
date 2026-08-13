import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token && user);

  // Sync state with storage changes or initialization
  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await authService.login(credentials);
      } catch (err) {
        // Dev fallback for Week 1 standalone UI testing if backend server is not running
        if (err.message.includes('Unable to connect')) {
          console.warn('Backend server unreachable. Using local dev session for UI demonstration.');
          data = {
            success: true,
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              id: 'user_1',
              fullName: credentials.email.split('@')[0] || 'Demo User',
              email: credentials.email,
              role: 'Shop Owner',
              companyName: 'Demo Spare Parts Shop',
            },
          };
        } else {
          throw err;
        }
      }

      const authToken = data.token || data.data?.token;
      const authUser = data.user || data.data?.user;

      if (authToken && authUser) {
        storage.setToken(authToken);
        storage.setUser(authUser);
        setToken(authToken);
        setUser(authUser);
        return { success: true, user: authUser };
      } else {
        throw new Error('Invalid response received from authentication server.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (companyData) => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await authService.registerCompany(companyData);
      } catch (err) {
        // Dev fallback for Week 1 standalone UI testing if backend server is not running
        if (err.message.includes('Unable to connect')) {
          console.warn('Backend server unreachable. Using local dev session for registration demonstration.');
          data = {
            success: true,
            message: 'Company registered successfully',
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              id: 'user_new',
              fullName: companyData.ownerName,
              email: companyData.email,
              role: 'Shop Owner',
              companyName: companyData.companyName,
            },
          };
        } else {
          throw err;
        }
      }

      const authToken = data.token || data.data?.token;
      const authUser = data.user || data.data?.user;

      if (authToken && authUser) {
        storage.setToken(authToken);
        storage.setUser(authUser);
        setToken(authToken);
        setUser(authUser);
        return { success: true, user: authUser };
      }

      return { success: true, message: data.message || 'Registration successful' };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      storage.clearAuth();
      setUser(null);
      setToken(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
