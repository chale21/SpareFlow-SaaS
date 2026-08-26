/**
 * Validation Middleware
 * 
 * Provides centralized validation for common operations like:
 * - Email format validation
 * - Password strength validation
 * - Numeric field validation
 * - Required field validation
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors
 * Returns 400 if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('companyName')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  
  body('ownerName')
    .trim()
    .notEmpty().withMessage('Owner name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Owner name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

const validateRefreshToken = [
  body('refreshToken').trim().notEmpty().withMessage('Refresh token is required'),
  handleValidationErrors
];

const validateForgotPassword = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
  handleValidationErrors
];

const validateResetPassword = [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  handleValidationErrors
];

const validateUpdateStaff = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phone').optional().trim().isLength({ max: 30 }).withMessage('Phone must not exceed 30 characters'),
  body('role').optional().isIn(['SHOP_OWNER', 'STAFF']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  handleValidationErrors
];

const validateCompanyUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 150 }).withMessage('Company name must be between 2 and 150 characters'),
  body('contactName').optional().trim().isLength({ max: 120 }).withMessage('Contact name must not exceed 120 characters'),
  body('contactPhone').optional().trim().isLength({ max: 30 }).withMessage('Contact phone must not exceed 30 characters'),
  body('address').optional().trim().isLength({ max: 300 }).withMessage('Address must not exceed 300 characters'),
  body('website').optional().trim().isURL().withMessage('Website must be a valid URL'),
  handleValidationErrors
];

/**
 * Validation rules for adding a product
 */
const validateAddProduct = [
  body('productName')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Product name must be between 2 and 200 characters'),
  
  body('categoryId')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  
  body('productCode')
    .trim()
    .notEmpty().withMessage('Product code is required')
    .isLength({ min: 1, max: 50 }).withMessage('Product code must be between 1 and 50 characters'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  
  body('purchasePrice')
    .notEmpty().withMessage('Purchase price is required')
    .isFloat({ min: 0 }).withMessage('Purchase price must be a non-negative number'),
  
  body('sellingPrice')
    .notEmpty().withMessage('Selling price is required')
    .isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number'),
  
  body('minimumStock')
    .notEmpty().withMessage('Minimum stock is required')
    .isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
  
  body('supplierId')
    .notEmpty().withMessage('Supplier is required')
    .isMongoId().withMessage('Invalid supplier ID'),
  
  handleValidationErrors
];

/**
 * Validation rules for updating a product
 */
const validateUpdateProduct = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('productName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Product name must be between 2 and 200 characters'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  
  body('purchasePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Purchase price must be a non-negative number'),
  
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number'),
  
  body('minimumStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative integer'),
  
  handleValidationErrors
];

/**
 * Validation rules for adding a category
 */
const validateAddCategory = [
  body('categoryName')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  handleValidationErrors
];

const validateUpdateCategory = [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('categoryName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  handleValidationErrors
];

/**
 * Validation rules for adding a supplier
 */
const validateAddSupplier = [
  body('supplierName')
    .trim()
    .notEmpty().withMessage('Supplier name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Supplier name must be between 2 and 100 characters'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9\-+]{10,}$/).withMessage('Invalid phone number format'),
  
  body('email')
  
    .trim()
    .isEmail().withMessage('Invalid email address'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),
  
  handleValidationErrors
];

const validateUpdateSupplier = [
  param('id').isMongoId().withMessage('Invalid supplier ID'),
  body('supplierName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Supplier name must be between 2 and 100 characters'),
  body('phone').optional().trim().matches(/^[0-9\-+]{10,}$/).withMessage('Invalid phone number format'),
  body('email').optional().trim().isEmail().withMessage('Invalid email address'),
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  handleValidationErrors
];

/**
 * Validation rules for recording a purchase
 */
const validatePurchase = [
  body('supplierId')
    .notEmpty().withMessage('Supplier is required')
    .isMongoId().withMessage('Invalid supplier ID'),
  
  body('items')
    .notEmpty().withMessage('Items are required')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required for each item')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required for each item')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  body('items.*.costPrice')
    .notEmpty().withMessage('Cost price is required for each item')
    .isFloat({ min: 0 }).withMessage('Cost price must be a non-negative number'),
  
  handleValidationErrors
];

/**
 * Validation rules for recording a sale
 */
const validateSale = [
  body('items')
    .notEmpty().withMessage('Items are required')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required for each item')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required for each item')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  body('customerName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Customer name must not exceed 100 characters'),
  
  handleValidationErrors
];

/**
 * Validation rules for adding a staff member
 */
const validateAddStaff = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['SHOP_OWNER', 'STAFF']).withMessage('Invalid role'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  
  handleValidationErrors
];

/**
 * Validation for MongoDB ObjectId parameters
 */
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName}`),
  
  handleValidationErrors
];

const validateStockMovementQuery = [
  query('productId').optional().isMongoId().withMessage('Invalid product ID'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword,
  validateAddProduct,
  validateUpdateProduct,
  validateAddCategory,
  validateUpdateCategory,
  validateAddSupplier,
  validateUpdateSupplier,
  validatePurchase,
  validateSale,
  validateAddStaff,
  validateUpdateStaff,
  validateCompanyUpdate,
  validateMongoId,
  validateStockMovementQuery
};
