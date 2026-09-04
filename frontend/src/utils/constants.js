/**
 * Global constants for SpareFlow frontend application.
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  SHOP_OWNER: 'Shop Owner',
  STAFF: 'Staff',
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
  },
  COMPANIES: {
    PROFILE: '/companies/profile',
    SETTINGS: '/companies/settings',
    LOGO: '/companies/logo',
  },
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SUPPLIERS: '/suppliers',
  PURCHASES: '/purchases',
  SALES: '/sales',
  REPORTS: '/reports',
};

export const APP_NAME = 'SpareFlow';
export const APP_TAGLINE = 'Smart Inventory Management System for Spare Parts Shops';
