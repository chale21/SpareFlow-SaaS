const jwt = require('jsonwebtoken');

/**
 * Authenticate user using JWT
 */
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      email: decoded.email,
      companyId: decoded.companyId,
      role: decoded.role,
      fullName: decoded.fullName
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

/**
 * Optional authentication
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith('Bearer ')
    ) {
      const token = authHeader.substring(7);

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = {
        id: decoded.id,
        email: decoded.email,
        companyId: decoded.companyId,
        role: decoded.role,
        fullName: decoded.fullName
      };
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateUser,
  optionalAuth
};