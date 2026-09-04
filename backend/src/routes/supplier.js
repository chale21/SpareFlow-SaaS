const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isShopOwner, isCompanyUser } = require('../middleware/role');
const { validateAddSupplier, validateUpdateSupplier, validateMongoId } = require('../middleware/validate');
const supplierController = require('../controllers/supplierController');

// Supplier management routes
router.use(authenticateUser, filterByCompany);
router.get('/', isCompanyUser, supplierController.list);

router.post('/', isShopOwner, validateAddSupplier, supplierController.create);

router.put('/:id', isShopOwner, validateUpdateSupplier, supplierController.update);

router.delete('/:id', isShopOwner, validateMongoId(), supplierController.remove);

router.get('/:id/purchases', isCompanyUser, validateMongoId(), supplierController.purchases);

module.exports = router;