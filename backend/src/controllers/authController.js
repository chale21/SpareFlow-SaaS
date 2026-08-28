const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Company = require('../models/Company');
const { generateToken } = require('../utils/jwt');

// ============================================================
// REGISTER COMPANY + SHOP OWNER
// ============================================================

const register = async (req, res) => {
    try {
        const {
            companyName,
            ownerName,
            email,
            password
        } = req.body;

        // --------------------------------------------------------
        // Validate required fields
        // --------------------------------------------------------

        if (!companyName || !ownerName || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    'Company name, owner name, email and password are required'
            });
        }

        // --------------------------------------------------------
        // Normalize values
        // --------------------------------------------------------

        const normalizedEmail = email.trim().toLowerCase();

        const cleanCompanyName = companyName.trim();
        const cleanOwnerName = ownerName.trim();

        // --------------------------------------------------------
        // Check existing user
        // --------------------------------------------------------

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        // --------------------------------------------------------
        // Hash password
        // --------------------------------------------------------

        const hashedPassword = await bcrypt.hash(password, 12);

        // --------------------------------------------------------
        // Create company
        // --------------------------------------------------------

       const company = await Company.create({
    name: cleanCompanyName,
    email: normalizedEmail
});

        // --------------------------------------------------------
        // Create shop owner
        // --------------------------------------------------------

        const user = await User.create({
            companyId: company._id,
            name: cleanOwnerName,
            email: normalizedEmail,
            password: hashedPassword,
            role: 'SHOP_OWNER',
            status: 'ACTIVE'
        });

        // --------------------------------------------------------
        // Generate JWT
        // --------------------------------------------------------

        const token = generateToken(user);

        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        return res.status(201).json({
            success: true,
            message: 'Company registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    companyId: user.companyId,
                    role: user.role,
                    status: user.status
                },

                company: {
                    id: company._id,
                    name: company.name
                },

                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);

        return res.status(500).json({
            success: false,
            message: 'Company registration failed'
        });
    }
};


// ============================================================
// LOGIN
// ============================================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // --------------------------------------------------------
        // Validate input
        // --------------------------------------------------------

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // --------------------------------------------------------
        // Find user
        // --------------------------------------------------------

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // --------------------------------------------------------
        // Check account status
        // --------------------------------------------------------

        if (user.status !== 'ACTIVE') {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive'
            });
        }

        // --------------------------------------------------------
        // Compare password
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Update last login
        // --------------------------------------------------------

        user.lastLogin = new Date();

        await user.save();

        // --------------------------------------------------------
        // Generate token
        // --------------------------------------------------------

        const token = generateToken(user);

        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    companyId: user.companyId,
                    role: user.role,
                    status: user.status
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
