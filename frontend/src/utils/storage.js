/**
 * Utility for managing authentication tokens and session persistence in localStorage.
 */

const TOKEN_KEY = 'spareflow_auth_token';
const USER_KEY = 'spareflow_auth_user';

export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (err) {
      console.error('Failed to save token to localStorage:', err);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.error('Failed to remove token from localStorage:', err);
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (err) {
      console.error('Failed to save user to localStorage:', err);
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Failed to remove user from localStorage:', err);
    }
  },

  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  },
};
