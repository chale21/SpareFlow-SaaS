const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Authenticate user using JWT
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Load user from database to check current status
    const user = await User.findById(decoded.id).select('isActive status email companyId role permissions');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if user account is active
    if (user.isActive === false || ['INACTIVE', 'SUSPENDED'].includes(user.status)) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact your administrator.'
      });
    }

    // Add user information to request
    req.user = {
      id: user._id,
      email: user.email,
      companyId: user.companyId,
      role: user.role
    };

    // Add permissions to request for STAFF users
    if (user.role === 'STAFF') {
      req.userPermissions = user.permissions || [];
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * Middleware to check if user is Shop Owner
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
 * Middleware to check if user is Super Admin
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

module.exports = {
  authenticateUser,
  isShopOwner,
  isSuperAdmin
};