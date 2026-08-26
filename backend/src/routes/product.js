const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isShopOwner, isCompanyUser } = require('../middleware/role');
const { validateAddProduct, validateUpdateProduct, validateMongoId } = require('../middleware/validate');
const productController = require('../controllers/productController');

// Product/Inventory management routes
router.use(authenticateUser, filterByCompany);
router.get('/search', isCompanyUser, productController.list);
router.get('/low-stock', isCompanyUser, (req, res, next) => { req.query.lowStock = 'true'; next(); }, productController.list);
router.get('/out-of-stock', isCompanyUser, (req, res, next) => { req.query.outOfStock = 'true'; next(); }, productController.list);
router.get('/', isCompanyUser, productController.list);
router.get('/:id', isCompanyUser, validateMongoId(), productController.get);

router.post('/', isShopOwner, validateAddProduct, productController.create);

router.put('/:id', isCompanyUser, validateUpdateProduct, productController.update);

router.delete('/:id', isShopOwner, validateMongoId(), productController.remove);

module.exports = router;