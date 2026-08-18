const express = require('express');

const router = express.Router();

const {
    register,
    login
} = require('../controllers/authController');

const {
    authenticateUser
} = require('../middleware/auth');


// POST /api/v1/auth/register
// Register a new user
// Public
router.post('/register', register);


// POST /api/v1/auth/login
// Login user
// Public
router.post('/login', login);


// POST /api/v1/auth/logout
// Logout user
// Private
router.post('/logout', authenticateUser, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
});


// GET /api/v1/auth/profile
// Get logged-in user profile
// Private
router.get('/profile', authenticateUser, (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
});


module.exports = router;