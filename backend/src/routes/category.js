/**
 * Category Routes
 * 
 * GET    /api/v1/categories      - Get all categories
 * POST   /api/v1/categories      - Add new category
 * PUT    /api/v1/categories/:id  - Update category
 * DELETE /api/v1/categories/:id  - Delete category
 */

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isShopOwner, isCompanyUser } = require('../middleware/role');
const { validateAddCategory, validateMongoId } = require('../middleware/validate');
const { validateUpdateCategory } = require('../middleware/validate');
const categoryController = require('../controllers/categoryController');

// All category routes require authentication and company filter
router.use(authenticateUser, filterByCompany);

// @route   GET /api/v1/categories
// @desc    Get all categories for the company
// @access  Private
router.get('/', isCompanyUser, categoryController.list);

// @route   POST /api/v1/categories
// @desc    Add new category
// @access  Private (Shop Owner)
router.post('/', isShopOwner, validateAddCategory, categoryController.create);

// @route   PUT /api/v1/categories/:id
// @desc    Update category
// @access  Private (Shop Owner)
router.put('/:id', isShopOwner, validateUpdateCategory, categoryController.update);

// @route   DELETE /api/v1/categories/:id
// @desc    Delete category
// @access  Private (Shop Owner)
router.delete('/:id', isShopOwner, validateMongoId('id'), categoryController.remove);

module.exports = router;