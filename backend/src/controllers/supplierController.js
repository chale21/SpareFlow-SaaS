const supplierService = require('../services/supplierService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendCreated } = require('../utils/response');

const list = catchAsync(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  sendSuccess(res, 'Suppliers retrieved successfully', await supplierService.list(req.companyId));
});
const create = catchAsync(async (req, res) => sendCreated(res, 'Supplier created successfully', await supplierService.create(req.companyId, req.body)));
const update = catchAsync(async (req, res) => sendSuccess(res, 'Supplier updated successfully', await supplierService.update(req.companyId, req.params.id, req.body)));
const remove = catchAsync(async (req, res) => {
  await supplierService.remove(req.companyId, req.params.id);
  sendSuccess(res, 'Supplier deleted successfully');
});
const purchases = catchAsync(async (req, res) => sendSuccess(res, 'Supplier purchases retrieved successfully', await supplierService.purchases(req.companyId, req.params.id)));

module.exports = { list, create, update, remove, purchases };
