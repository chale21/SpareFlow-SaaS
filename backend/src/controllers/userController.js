const userService = require('../services/userService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendCreated } = require('../utils/response');

const listStaff = catchAsync(async (req, res) => {
  const users = await userService.listStaff(req.companyId);
  sendSuccess(res, 'Staff retrieved successfully', users);
});

const createStaff = catchAsync(async (req, res) => {
  const user = await userService.createStaff(req.companyId, {
    ...req.body,
    canManagePermissions: ['SHOP_OWNER', 'SUPER_ADMIN'].includes(req.user.role)
  });
  sendCreated(res, 'Staff member created successfully', user);
});

const updateStaff = catchAsync(async (req, res) => {
  const user = await userService.updateStaff(req.companyId, req.params.id, {
    ...req.body,
    canManagePermissions: ['SHOP_OWNER', 'SUPER_ADMIN'].includes(req.user.role)
  });
  sendSuccess(res, 'Staff member updated successfully', user);
});

const deleteStaff = catchAsync(async (req, res) => {
  await userService.deleteStaff(req.companyId, req.params.id, req.user.id);
  sendSuccess(res, 'Staff member deleted successfully');
});

module.exports = { listStaff, createStaff, updateStaff, deleteStaff };
