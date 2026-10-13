const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { requirePermission } = require('../middleware/permissions');
const { validatePurchase, validateMongoId } = require('../middleware/validate');
const purchaseController = require('../controllers/purchaseController');

// Purchase management routes
router.use(authenticateUser, filterByCompany);
router.get('/history', requirePermission('purchases.view'), purchaseController.list);
router.get('/', requirePermission('purchases.view'), purchaseController.list);

router.post('/', requirePermission('purchases.create'), validatePurchase, purchaseController.create);

router.put('/:id/receive', requirePermission('purchases.receive'), validateMongoId(), purchaseController.receive);


module.exports = router;