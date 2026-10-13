const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requirePermissionForBodyField
} = require('../middleware/permissions');
const { validateAddProduct, validateUpdateProduct, validateMongoId } = require('../middleware/validate');
const productController = require('../controllers/productController');

// Product/Inventory management routes
router.use(authenticateUser, filterByCompany);
const canViewInventory = requireAnyPermission(['products.view', 'inventory.view']);
router.get('/search', canViewInventory, productController.list);
router.get('/low-stock', canViewInventory, (req, res, next) => { req.query.lowStock = 'true'; next(); }, productController.list);
router.get('/out-of-stock', canViewInventory, (req, res, next) => { req.query.outOfStock = 'true'; next(); }, productController.list);
router.get('/', canViewInventory, productController.list);
router.get('/:id', canViewInventory, validateMongoId(), productController.get);

router.post(
  '/',
  requireAllPermissions(['products.create', 'inventory.create']),
  validateAddProduct,
  productController.create
);

router.put(
  '/:id',
  requirePermission('products.update'),
  requirePermissionForBodyField('quantity', 'inventory.adjust'),
  validateUpdateProduct,
  productController.update
);

router.delete('/:id', requirePermission('products.delete'), validateMongoId(), productController.remove);

module.exports = router;