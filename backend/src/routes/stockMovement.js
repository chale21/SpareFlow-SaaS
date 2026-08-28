const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isCompanyUser } = require('../middleware/role');
const { validateMongoId, validateStockMovementQuery } = require('../middleware/validate');
const productService = require('../services/productService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/response');

router.use(authenticateUser, filterByCompany);
router.get('/', isCompanyUser, validateStockMovementQuery, catchAsync(async (req, res) => {
  const StockMovement = require('../models/StockMovement');
  const productFilter = req.query.productId ? { productId: req.query.productId } : {};
  const movements = await StockMovement.find({ companyId: req.companyId, ...productFilter })
    .populate('productId', 'productName productCode')
    .sort({ createdAt: -1 });
  sendSuccess(res, 'Stock movements retrieved successfully', movements);
}));

router.get('/:id', isCompanyUser, validateMongoId(), catchAsync(async (req, res) => {
  sendSuccess(res, 'Product stock movements retrieved successfully', await productService.movements(req.companyId, req.params.id));
}));

module.exports = router;
