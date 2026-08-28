const companyService = require('../services/companyService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/response');

const getProfile = catchAsync(async (req, res) => {
  const company = await companyService.getProfile(req.companyId);
  sendSuccess(res, 'Company profile retrieved successfully', company);
});

const updateProfile = catchAsync(async (req, res) => {
  const company = await companyService.updateProfile(req.companyId, req.body);
  sendSuccess(res, 'Company profile updated successfully', company);
});

module.exports = { getProfile, updateProfile };
