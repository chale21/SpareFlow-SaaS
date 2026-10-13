const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { requirePermission } = require('../middleware/permissions');
const { validateAddSupplier, validateUpdateSupplier, validateMongoId } = require('../middleware/validate');
const supplierController = require('../controllers/supplierController');

// Supplier management routes
router.use(authenticateUser, filterByCompany);
router.get('/', requirePermission('suppliers.view'), supplierController.list);

router.post('/', requirePermission('suppliers.create'), validateAddSupplier, supplierController.create);

router.put('/:id', requirePermission('suppliers.update'), validateUpdateSupplier, supplierController.update);

router.delete('/:id', requirePermission('suppliers.delete'), validateMongoId(), supplierController.remove);

router.get('/:id/purchases', requirePermission('suppliers.view'), validateMongoId(), supplierController.purchases);

module.exports = router;