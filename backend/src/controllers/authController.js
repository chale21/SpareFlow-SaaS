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
        // Basic password validation
        // --------------------------------------------------------

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

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
        // Check existing company
        // --------------------------------------------------------

        const existingCompany = await Company.findOne({
            name: cleanCompanyName
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: 'A company with this name already exists'
            });
        }

        // --------------------------------------------------------
        // Create company
        //
        // Company schema uses contactEmail, NOT email.
        // --------------------------------------------------------

        const company = await Company.create({
            name: cleanCompanyName,
            contactName: cleanOwnerName,
            contactEmail: normalizedEmail,
            status: 'ACTIVE'
        });

        // --------------------------------------------------------
        // Create shop owner
        //
        // IMPORTANT:
        // Do NOT bcrypt.hash() here.
        //
        // User model's pre-save middleware handles hashing.
        // --------------------------------------------------------

        const user = await User.create({
            companyId: company._id,
            name: cleanOwnerName,
            fullName: cleanOwnerName,
            email: normalizedEmail,
            password: password,
            role: 'SHOP_OWNER',
            status: 'ACTIVE',
            isActive: true
        });

        // --------------------------------------------------------
        // Set createdBy after user exists
        // --------------------------------------------------------

        company.createdBy = user._id;
        await company.save();

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
                    fullName: user.fullName,
                    email: user.email,
                    companyId: user.companyId,
                    role: user.role,
                    status: user.status
                },

                company: {
                    id: company._id,
                    name: company.name,
                    contactName: company.contactName,
                    contactEmail: company.contactEmail,
                    status: company.status
                },

                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);

        // --------------------------------------------------------
        // Duplicate key error
        // --------------------------------------------------------

        if (error.code === 11000) {
            console.error('Duplicate key details:', error.keyValue);

            return res.status(409).json({
                success: false,
                message: 'A record with the same unique value already exists',
                error: error.keyValue
            });
        }

        // --------------------------------------------------------
        // Mongoose validation error
        // --------------------------------------------------------

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // --------------------------------------------------------
        // General error
        // --------------------------------------------------------

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
        //
        // IMPORTANT:
        // password has select:false in User schema.
        // We MUST explicitly select it.
        // --------------------------------------------------------

        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password');

        // --------------------------------------------------------
        // User not found
        // --------------------------------------------------------

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // --------------------------------------------------------
        // Check password exists
        // --------------------------------------------------------

        if (!user.password) {
            console.error(
                `User ${user._id} does not have a password`
            );

            return res.status(500).json({
                success: false,
                message: 'User account has an invalid password configuration'
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
        // Check isActive
        // --------------------------------------------------------

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive'
            });
        }

        // --------------------------------------------------------
        // Compare password
        //
        // Use the User model's comparePassword method.
        // --------------------------------------------------------

        const passwordMatch = await user.comparePassword(password);

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
        // Generate JWT
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
                    fullName: user.fullName,
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

        // --------------------------------------------------------
        // Mongoose validation error
        // --------------------------------------------------------

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(
                (err) => err.message
            );

            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // --------------------------------------------------------
        // General error
        // --------------------------------------------------------

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