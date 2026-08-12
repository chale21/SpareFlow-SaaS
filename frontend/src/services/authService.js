import api from './api';
import { API_ROUTES } from '../utils/constants';

/**
 * Authentication Service handling API calls for authentication & registration.
 * Connects to backend API endpoints matching Section 14.3 of the SRS documentation.
 */
export const authService = {
  /**
   * User Login API request.
   * Endpoint: POST /auth/login
   */
  login: async (credentials) => {
    try {
      const response = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error) {
      // If backend API is offline during Week 1 frontend testing, throw structured error or offline fallback
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error('Unable to connect to SpareFlow backend service. Please ensure server is running.');
      }
      const message = error.response?.data?.message || 'Login failed. Please verify your credentials.';
      throw new Error(message);
    }
  },

  /**
   * Register Company API request.
   * Endpoint: POST /auth/register
   * Payload: { companyName, ownerName, email, password }
   */
  registerCompany: async (companyData) => {
    try {
      const response = await api.post(API_ROUTES.AUTH.REGISTER, companyData);
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error('Unable to connect to SpareFlow backend service. Please ensure server is running.');
      }
      const message = error.response?.data?.message || 'Company registration failed. Please try again.';
      throw new Error(message);
    }
  },

  /**
   * Logout API request.
   * Endpoint: POST /auth/logout
   */
  logout: async () => {
    try {
      const response = await api.post(API_ROUTES.AUTH.LOGOUT);
      return response.data;
    } catch {
      // Clean exit even if server request fails
      return { success: true };
    }
  },

  /**
   * Fetch Logged-in User Profile.
   * Endpoint: GET /auth/profile
   */
  getProfile: async () => {
    try {
      const response = await api.get(API_ROUTES.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user profile';
      throw new Error(message);
    }
  },
};

export default authService;
