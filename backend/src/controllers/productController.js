const productService = require('../services/productService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendCreated } = require('../utils/response');

const list = catchAsync(async (req, res) => sendSuccess(res, 'Products retrieved successfully', await productService.list(req.companyId, req.query)));
const get = catchAsync(async (req, res) => sendSuccess(res, 'Product retrieved successfully', await productService.get(req.companyId, req.params.id)));
const create = catchAsync(async (req, res) => sendCreated(res, 'Product created successfully', await productService.create(req.companyId, req.body)));
const update = catchAsync(async (req, res) => sendSuccess(res, 'Product updated successfully', await productService.update(req.companyId, req.params.id, req.body, req.user.id)));
const remove = catchAsync(async (req, res) => {
  await productService.remove(req.companyId, req.params.id);
  sendSuccess(res, 'Product deleted successfully');
});
const movements = catchAsync(async (req, res) => sendSuccess(res, 'Stock movements retrieved successfully', await productService.movements(req.companyId, req.params.id)));

module.exports = { list, get, create, update, remove, movements };
