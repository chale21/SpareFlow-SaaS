const categoryService = require('../services/categoryService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendCreated } = require('../utils/response');

const list = catchAsync(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  sendSuccess(res, 'Categories retrieved successfully', await categoryService.list(req.companyId));
});
const create = catchAsync(async (req, res) => sendCreated(res, 'Category created successfully', await categoryService.create(req.companyId, req.body)));
const update = catchAsync(async (req, res) => sendSuccess(res, 'Category updated successfully', await categoryService.update(req.companyId, req.params.id, req.body)));
const remove = catchAsync(async (req, res) => {
  await categoryService.remove(req.companyId, req.params.id);
  sendSuccess(res, 'Category deleted successfully');
});

module.exports = { list, create, update, remove };
