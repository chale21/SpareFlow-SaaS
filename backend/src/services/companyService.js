const Company = require('../models/Company');
const { AppError } = require('../middleware/errorHandler');

const getProfile = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company || company.isDeleted) throw new AppError('Company not found', 404);
  return company;
};

const updateProfile = async (companyId, data) => {
  const updates = {};
  const allowedFields = ['name', 'contactName', 'contactPhone', 'contactEmail', 'address', 'website'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });

  const allowedSettings = [
    'currency',
    'timezone',
    'dateFormat',
    'lowStockThreshold',
    'invoicePrefix',
    'taxRate',
    'lowStockNotifications',
    'emailNotifications'
  ];
  allowedSettings.forEach((field) => {
    if (data.settings?.[field] !== undefined) {
      updates[`settings.${field}`] = data.settings[field];
    }
  });

  const company = await Company.findOneAndUpdate(
    { _id: companyId, isDeleted: { $ne: true } },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!company) throw new AppError('Company not found', 404);

  return company;
};

module.exports = { getProfile, updateProfile };
