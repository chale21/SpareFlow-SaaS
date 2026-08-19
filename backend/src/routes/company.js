const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isCompanyUser, isShopOwner } = require('../middleware/role');
const { validateCompanyUpdate } = require('../middleware/validate');
const companyController = require('../controllers/companyController');

router.use(authenticateUser, filterByCompany);
router.get('/profile', isCompanyUser, companyController.getProfile);

router.put('/profile', isShopOwner, validateCompanyUpdate, companyController.updateProfile);

module.exports = router;