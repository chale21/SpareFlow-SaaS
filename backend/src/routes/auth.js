const express = require('express');

const router = express.Router();

const {
    register,
    login
} = require('../controllers/authController');

const {
    authenticateUser
} = require('../middleware/auth');


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
    (req, res) => {
        return res.status(200).json({
            success: true,
            data: {
                user: req.user
            }
        });
    }
);


module.exports = router;