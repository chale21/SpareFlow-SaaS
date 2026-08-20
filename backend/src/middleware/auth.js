const { verifyToken } = require('../utils/jwt');

/**
 * Authenticate user using JWT
 */
const authenticateUser = (req, res, next) => {
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

    // Add user information to request
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