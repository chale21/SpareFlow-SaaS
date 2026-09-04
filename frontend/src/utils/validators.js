/**
 * Client-side validation utilities for SpareFlow forms.
 */

// Email regex pattern matching standard email formats
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates if a field value is non-empty.
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Validates email format.
 */
export const validateEmail = (email) => {
  if (!email || !String(email).trim()) {
    return 'Email address is required';
  }
  if (!EMAIL_REGEX.test(String(email).trim())) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Validates password format.
 * Requirement: Minimum 6 characters (as per standard JWT/auth conventions).
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  return '';
};

/**
 * Validates Login Form fields.
 */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Validates Registration Form fields based on SRS requirements:
 * - Company Name
 * - Owner Name
 * - Email
 * - Password
 */
export const validateRegisterForm = ({ companyName, ownerName, email, password }) => {
  const errors = {};

  const companyError = validateRequired(companyName, 'Company name');
  if (companyError) errors.companyName = companyError;

  const ownerError = validateRequired(ownerName, 'Owner name');
  if (ownerError) errors.ownerName = ownerError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
