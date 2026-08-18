const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Company = require('../models/Company');
const { generateToken } = require('../utils/jwt');

// Register user
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            companyId
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !companyId) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password and companyId are required'
            });
        }

        // Check if company exists
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Check existing user by email globally
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user (do not trust role from client; use model default)
        const user = await User.create({
            companyId,
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Generate JWT
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    companyId: user.companyId,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};


// Login user
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check account status
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive'
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    companyId: user.companyId,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};


module.exports = {
    register,
    login
};