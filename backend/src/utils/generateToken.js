/**
 * JWT Token Generation Utility
 * 
 * Handles creation and verification of JSON Web Tokens for authentication.
 * Used for secure user authentication and authorization.
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {Object} payload - Data to encode in token (userId, email, role, companyId)
 * @param {number} expiresIn - Token expiration time (default: 7 days)
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = '7d') => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
      algorithm: 'HS256'
    });

    return token;
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw error;
  }
};

/**
 * Generate short-lived token for password reset
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {number} expiresIn - Expiration time (default: 1 hour)
 * @returns {string} Reset token
 */
const generateResetToken = (userId, email, expiresIn = '1h') => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const token = jwt.sign(
      {
        id: userId,
        email,
        type: 'password_reset'
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
        algorithm: 'HS256'
      }
    );

    return token;
  } catch (error) {
    console.error('Error generating reset token:', error.message);
    throw error;
  }
};

/**
 * Generate email verification token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {number} expiresIn - Expiration time (default: 24 hours)
 * @returns {string} Verification token
 */
const generateVerificationToken = (userId, email, expiresIn = '24h') => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const token = jwt.sign(
      {
        id: userId,
        email,
        type: 'email_verification'
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
        algorithm: 'HS256'
      }
    );

    return token;
  } catch (error) {
    console.error('Error generating verification token:', error.message);
    throw error;
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Decode token without verification
 * Useful for getting token information before verification
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Error decoding token');
  }
};

/**
 * Create authentication tokens for user
 * Returns both access token and refresh token
 */
const createAuthTokens = (userId, email, companyId, role, fullName) => {
  try {
    const accessToken = generateToken(
      {
        id: userId,
        email,
        companyId,
        role,
        fullName,
        type: 'access'
      },
      '24h' // Access token valid for 24 hours
    );

    const refreshToken = generateToken(
      {
        id: userId,
        email,
        companyId,
        type: 'refresh'
      },
      '7d' // Refresh token valid for 7 days
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400 // 24 hours in seconds
    };
  } catch (error) {
    console.error('Error creating auth tokens:', error.message);
    throw error;
  }
};

/**
 * Verify refresh token and generate new access token
 */
const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = generateToken(
      {
        id: decoded.id,
        email: decoded.email,
        companyId: decoded.companyId,
        type: 'access'
      },
      '24h'
    );

    return {
      accessToken: newAccessToken,
      expiresIn: 86400
    };
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
};

module.exports = {
  generateToken,
  generateResetToken,
  generateVerificationToken,
  verifyToken,
  decodeToken,
  createAuthTokens,
  refreshAccessToken
};
