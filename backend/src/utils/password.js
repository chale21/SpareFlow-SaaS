/**
 * Password Utility
 * 
 * Handles password hashing, verification, and validation.
 * Uses bcryptjs for secure password storage.
 * Passwords are never stored in plain text.
 */

const bcrypt = require('bcryptjs');

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password to hash
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password, saltRounds = 10) => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error.message);
    throw error;
  }
};

/**
 * Compare plain text password with hashed password
 * @param {string} plainPassword - Plain text password to verify
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    if (!plainPassword || !hashedPassword) {
      return false;
    }

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error.message);
    throw error;
  }
};

/**
 * Validate password strength
 * Checks for minimum requirements:
 * - At least 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - Optionally: special characters
 * 
 * @param {string} password - Password to validate
 * @param {boolean} requireSpecialChar - Require special characters
 * @returns {Object} Validation result with isValid flag and messages
 */
const validatePasswordStrength = (password, requireSpecialChar = false) => {
  const result = {
    isValid: true,
    errors: [],
    strength: 'weak' // weak, medium, strong
  };

  if (!password) {
    result.isValid = false;
    result.errors.push('Password is required');
    return result;
  }

  // Check length
  if (password.length < 6) {
    result.isValid = false;
    result.errors.push('Password must be at least 6 characters long');
  }

  if (password.length < 8) {
    result.strength = 'weak';
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (!/\d/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one number');
  }

  // Check for special characters if required
  if (requireSpecialChar && !/[!@#$%^&*()_+\-=\x5B\]{};':"\\|,.<>/?]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one special character');
  }
  
  // Determine strength
  if (result.isValid) {
    if (password.length >= 12 && /[!@#$%^&*()_+\-=\x5B\]{};':"\\|,.<>/?]/.test(password)) {
      result.strength = 'strong';
    } else if (password.length >= 10) {
      result.strength = 'medium';
    } else {
      result.strength = 'weak';
    }
  }

  return result;
};

/**
 * Generate a temporary password
 * Useful for account creation or password reset
 * @param {number} length - Length of generated password (default: 12)
 * @returns {string} Generated temporary password
 */
const generateTemporaryPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  const all = uppercase + lowercase + numbers + special;
  let password = '';

  // Ensure at least one of each required character
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Check if password matches pattern/regex
 * @param {string} password - Password to check
 * @param {RegExp} pattern - Pattern to match against
 * @returns {boolean}
 */
const matchesPattern = (password, pattern) => {
  return pattern.test(password);
};

module.exports = {
  hashPassword,
  comparePasswords,
  validatePasswordStrength,
  generateTemporaryPassword,
  matchesPattern
};
