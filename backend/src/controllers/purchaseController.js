const purchaseService = require('../services/purchaseService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendCreated } = require('../utils/response');

const list = catchAsync(async (req, res) => sendSuccess(res, 'Purchases retrieved successfully', await purchaseService.list(req.companyId, req.query.status)));
const create = catchAsync(async (req, res) => sendCreated(res, 'Purchase created successfully', await purchaseService.create(req.companyId, req.user.id, req.body)));
const receive = catchAsync(async (req, res) => sendSuccess(res, 'Purchase received and stock updated successfully', await purchaseService.receive(req.companyId, req.params.id, req.user.id)));

module.exports = { list, create, receive };
