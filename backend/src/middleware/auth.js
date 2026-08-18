const { verifyToken } = require('../utils/jwt');

/**
 * Authenticate user using JWT
 */
const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7);

        const decoded = verifyToken(token);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            companyId: decoded.companyId,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};


/**
 * Check if user is a Shop Owner
 */
const isShopOwner = (req, res, next) => {
    if (req.user && req.user.role === 'SHOP_OWNER') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. Shop Owner role required.'
    });
};


/**
 * Check if user is a Super Admin
 */
const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'SUPER_ADMIN') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. Super Admin role required.'
    });
};


/**
 * Check if user is Staff
 */
const isStaff = (req, res, next) => {
    if (req.user && req.user.role === 'STAFF') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. Staff role required.'
    });
};


module.exports = {
    authenticateUser,
    isShopOwner,
    isSuperAdmin,
    isStaff
};