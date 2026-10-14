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
  register,
  login,
} = require('../controllers/authController');

// ============================================================
// REGISTER
// POST /api/v1/auth/register
// Public
// ============================================================

router.post('/register', register);


// ============================================================
// LOGIN
// POST /api/v1/auth/login
// Public
// ============================================================

router.post('/login', login);


// ============================================================
// LOGOUT
// POST /api/v1/auth/logout
// Private
// ============================================================

router.post(
    '/logout',
    authenticateUser,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
);


// ============================================================
// PROFILE
// GET /api/v1/auth/profile
// Private
// ============================================================

router.get(
    '/profile',
    authenticateUser,
    async (req, res) => {
        try {
            const User = require('../models/User');
            const user = await User.findById(req.user.id).select('-password');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        companyId: user.companyId,
                        isActive: user.isActive,
                        role: user.role,
                        status: user.status,
                        permissions: user.permissions || []
                    }
                }
            });
        } catch (error) {
            console.error('Profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch profile'
            });
        }
    }
);


module.exports = router;