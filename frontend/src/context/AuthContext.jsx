import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

// const TOKEN_KEY = 'spareflow_token';
// const USER_KEY = 'spareflow_user';

export const AuthProvider = ({ children }) => {
  // ============================================================
  // STATE
  // ============================================================

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================================================
  // INITIALIZE AUTHENTICATION
  // ============================================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
       const storedToken = storage.getToken();
const storedUser = storage.getUser();

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);

        // Use stored user immediately if available
        if (storedUser) {
  setUser(storedUser);
}

        // Verify token and retrieve current profile
        const response = await authService.getProfile();

        if (response?.success && response?.data?.user) {
          const currentUser = response.data.user;

          setUser(currentUser);
         storage.setUser(currentUser);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);

        // Token is invalid or expired
       storage.clearAuth();

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authService.login(credentials);

      if (!response?.success) {
        return {
          success: false,
          error: response?.message || 'Login failed.'
        };
      }

      const receivedToken = response?.data?.token;
      const receivedUser = response?.data?.user;

      if (!receivedToken || !receivedUser) {
        return {
          success: false,
          error: 'Invalid login response from server.'
        };
      }

      // Store authentication information
     storage.setToken(receivedToken);
     storage.setUser(receivedUser);

      setToken(receivedToken);
      setUser(receivedUser);

      return {
        success: true,
        user: receivedUser
      };
    } catch (error) {
      const message =
        error?.message ||
        'Login failed. Please try again.';

      setError(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // REGISTER
  // ============================================================

  const register = async (companyData) => {
    try {
      setIsLoading(true);
      setError('');

      const response =
        await authService.registerCompany(companyData);

      if (!response?.success) {
        return {
          success: false,
          error:
            response?.message ||
            'Company registration failed.'
        };
      }

      const receivedToken = response?.data?.token;
      const receivedUser = response?.data?.user;

      if (!receivedToken || !receivedUser) {
        return {
          success: false,
          error:
            'Registration succeeded but authentication data was not returned.'
        };
      }

      // Store authentication information
      storage.setToken(receivedToken);
      storage.setUser(receivedUser);

      setToken(receivedToken);
      setUser(receivedUser);

      return {
        success: true,
        user: receivedUser
      };
    } catch (error) {
      const message =
        error?.message ||
        'Company registration failed.';

      setError(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {
    try {
      setIsLoading(true);

      // Tell backend about logout
      await authService.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear local authentication
      storage.clearAuth();

      setToken(null);
      setUser(null);
      setError('');

      setIsLoading(false);
    }
  };

  // ============================================================
  // CLEAR ERROR
  // ============================================================

  const clearError = () => {
    setError('');
  };

  // ============================================================
  // ROLE HELPERS
  // ============================================================

  const isSuperAdmin =
    user?.role === 'SUPER_ADMIN';

  const isShopOwner =
    user?.role === 'SHOP_OWNER';

  const isStaff =
    user?.role === 'STAFF';

  // ============================================================
  // AUTHENTICATION STATUS
  // ============================================================

  const isAuthenticated =
    Boolean(user && token);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = {
    user,
    token,

    isAuthenticated,
    isLoading,

    error,

    login,
    register,
    logout,

    clearError,

    isSuperAdmin,
    isShopOwner,
    isStaff
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;