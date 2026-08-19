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
                message: 'Authentication required'
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
            message: 'Authentication required'
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
        message: 'Access denied. Insufficient permissions.'
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
        message: 'Access denied. Insufficient permissions.'
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
        message: 'Access denied. Insufficient permissions.'
    });
};


// Generic role authorization middleware factory
// Usage: authorizeRoles('SUPER_ADMIN'), authorizeRoles('SHOP_OWNER','STAFF')
// Allows access if req.user.role matches one of the provided roles.
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    return next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  isShopOwner,
  isSuperAdmin,
  isStaff
};