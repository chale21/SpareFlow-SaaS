const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { notifyCompany } = require('./notificationService');
const { validatePermissions } = require('../config/permissions');

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName || user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  companyId: user.companyId,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  permissions: user.permissions || [],
  createdAt: user.createdAt
});

const listStaff = async (companyId) => {
  const users = await User.find({ companyId, role: 'STAFF' }).sort({ createdAt: -1 });
  return users.map(sanitizeUser);
};

const createStaff = async (companyId, data) => {
  const email = data.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('User already exists with this email', 409);

  if (data.role && data.role !== 'STAFF') {
    throw new AppError('Staff accounts must use the STAFF role', 403);
  }
  if (data.permissions !== undefined && data.permissions.length > 0 && !data.canManagePermissions) {
    throw new AppError('Only an authorized owner can assign staff permissions', 403);
  }
  
  let permissions = [];
  if (data.permissions !== undefined) {
    const validation = validatePermissions(data.permissions);
    if (!validation.valid) {
      throw new AppError(`Invalid permissions: ${validation.invalid.join(', ')}`, 400);
    }
    permissions = data.permissions;
  }

  const user = await User.create({
    companyId,
    name: data.fullName,
    fullName: data.fullName,
    email,
    password: data.password,
    role: 'STAFF',
    phone: data.phone,
    permissions
  });
  
  if (user.role === 'STAFF') {
    await notifyCompany({
      companyId,
      roles: ['SHOP_OWNER'],
      type: 'NEW_STAFF',
      title: 'New team member added',
      message: `${user.fullName || user.name} has been added to your company.`,
      link: '/users',
      resourceType: 'user',
      resourceId: user._id,
      dedupeKey: `new-staff:${user._id}`
    });
  }
  return sanitizeUser(user);
};

const updateStaff = async (companyId, userId, data) => {
  const user = await User.findOne({ _id: userId, companyId, role: 'STAFF' });
  if (!user) throw new AppError('User not found', 404);

  if (data.role !== undefined) {
    throw new AppError('Staff roles cannot be changed', 403);
  }

  if (data.permissions !== undefined && !data.canManagePermissions) {
    throw new AppError('Only an authorized owner can manage staff permissions', 403);
  }

  if (data.email && data.email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: userId } });
    if (existing) throw new AppError('User already exists with this email', 409);
    user.email = data.email.toLowerCase();
  }

  if (data.fullName !== undefined) {
    user.name = data.fullName;
    user.fullName = data.fullName;
  }

  // Handle permissions update for STAFF
  if (data.permissions !== undefined && user.role === 'STAFF') {
    const validation = validatePermissions(data.permissions);
    if (!validation.valid) {
      throw new AppError(`Invalid permissions: ${validation.invalid.join(', ')}`, 400);
    }
    user.permissions = data.permissions;
  }

  ['phone', 'isActive'].forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
      if (field === 'isActive') user.status = data[field] ? 'ACTIVE' : 'INACTIVE';
    }
  });
  
  await user.save();
  return sanitizeUser(user);
};

const deleteStaff = async (companyId, userId, currentUserId) => {
  if (String(userId) === String(currentUserId)) throw new AppError('You cannot delete your own account', 400);
  const user = await User.findOneAndDelete({ _id: userId, companyId, role: 'STAFF' });
  if (!user) throw new AppError('User not found', 404);
};

module.exports = { listStaff, createStaff, updateStaff, deleteStaff };
