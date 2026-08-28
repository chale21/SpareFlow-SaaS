const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isCompanyUser } = require('../middleware/role');
const { validatePurchase, validateMongoId } = require('../middleware/validate');
const purchaseController = require('../controllers/purchaseController');

// Purchase management routes
router.use(authenticateUser, filterByCompany);
router.get('/history', isCompanyUser, purchaseController.list);
router.get('/', isCompanyUser, purchaseController.list);

router.post('/', isCompanyUser, validatePurchase, purchaseController.create);

router.put('/:id/receive', isCompanyUser, validateMongoId(), purchaseController.receive);


module.exports = router;