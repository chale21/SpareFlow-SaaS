const Company = require('../models/Company');
const { AppError } = require('../middleware/errorHandler');

const getProfile = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company || company.isDeleted) throw new AppError('Company not found', 404);
  return company;
};

const updateProfile = async (companyId, data) => {
  const company = await getProfile(companyId);
  const allowedFields = ['name', 'contactName', 'contactPhone', 'address', 'website'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) company[field] = data[field];
  });
  await company.save();
  return company;
};

module.exports = { getProfile, updateProfile };
