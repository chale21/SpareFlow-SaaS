const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isShopOwner, isCompanyUser } = require('../middleware/role');
const { validateAddStaff, validateUpdateStaff, validateMongoId } = require('../middleware/validate');
const userController = require('../controllers/userController');

router.use(authenticateUser, filterByCompany);
router.get('/', isCompanyUser, userController.listStaff);
router.post('/', isShopOwner, validateAddStaff, userController.createStaff);

router.put('/:id', isShopOwner, validateUpdateStaff, userController.updateStaff);

router.delete('/:id', isShopOwner, validateMongoId(), userController.deleteStaff);

module.exports = router;