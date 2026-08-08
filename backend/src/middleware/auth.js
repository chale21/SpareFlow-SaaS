const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate user using JWT token
 */
const authenticateUser = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object
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
      message: 'Invalid token.'
    });
  }
};

/**
 * Middleware to check if user is Shop Owner
 */
const isShopOwner = (req, res, next) => {
  if (req.user && req.user.role === 'Owner') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Shop Owner role required.'
    });
  }
};

/**
 * Middleware to check if user is Super Admin
 */
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'SuperAdmin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin role required.'
    });
  }
};

module.exports = {
  authenticateUser,
  isShopOwner,
  isSuperAdmin
};