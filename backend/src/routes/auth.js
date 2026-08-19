/**
 * Authentication Routes
 * 
 * POST   /api/v1/auth/register        - Register new company
 * POST   /api/v1/auth/login           - Login user
 * POST   /api/v1/auth/logout          - Logout user
 * POST   /api/v1/auth/forgot-password - Request password reset
 * POST   /api/v1/auth/reset-password  - Reset password
 * GET    /api/v1/auth/profile         - Get user profile
 */

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/security');
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword
} = require('../middleware/validate');
const authController = require('../controllers/authController');

// @route   POST /api/v1/auth/register
// @desc    Register new company and owner account
// @access  Public
router.post('/register', authRateLimiter, validateRegister, authController.register);

// @route   POST /api/v1/auth/login
// @desc    Login user with email and password
// @access  Public
router.post('/login', authRateLimiter, validateLogin, authController.login);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private (Authenticated)
router.post('/refresh', authRateLimiter, validateRefreshToken, authController.refresh);
router.post('/logout', authenticateUser, authController.logout);

// @route   POST /api/v1/auth/forgot-password
// @desc    Request password reset - sends reset link to email
// @access  Public
router.post('/forgot-password', authRateLimiter, validateForgotPassword, authController.forgotPassword);

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password using reset token
// @access  Public
router.post('/reset-password', authRateLimiter, validateResetPassword, authController.resetPassword);

// @route   GET /api/v1/auth/profile
// @desc    Get logged-in user profile
// @access  Private (Authenticated)
router.get('/profile', authenticateUser, authController.profile);

module.exports = router;