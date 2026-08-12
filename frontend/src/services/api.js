import axios from 'axios';
import { storage } from '../utils/storage';

/**
 * Centralized Axios instance for SpareFlow API communication.
 * Base URL defaults to VITE_API_URL environment variable or standard backend port.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Request Interceptor: Attach JWT Bearer Token to outgoing requests if available.
 */
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Handle global response errors (e.g. 401 Unauthorized, 403 Forbidden).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthenticated request fallback
      if (error.response.status === 401) {
        storage.clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
