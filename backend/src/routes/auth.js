const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const {
    register,
    login
} = require('../controllers/authController');

const {
    authenticateUser
} = require('../middleware/auth');
const validate = require('../middleware/validate');


// POST /api/v1/auth/register
// Register a new user
// Public
router.post(
    '/register',
    validate([
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('companyId').notEmpty().withMessage('companyId is required')
    ]),
    register
);


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