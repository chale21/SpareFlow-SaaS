const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName || user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  companyId: user.companyId,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt
});

const listStaff = async (companyId) => {
  const users = await User.find({ companyId }).sort({ createdAt: -1 });
  return users.map(sanitizeUser);
};

const createStaff = async (companyId, data) => {
  const email = data.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('User already exists with this email', 409);

  const user = await User.create({
    companyId,
    name: data.fullName,
    fullName: data.fullName,
    email,
    password: data.password,
    role: data.role || 'STAFF',
    phone: data.phone
  });
  return sanitizeUser(user);
};

const updateStaff = async (companyId, userId, data) => {
  const user = await User.findOne({ _id: userId, companyId });
  if (!user) throw new AppError('User not found', 404);

  if (data.email && data.email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: userId } });
    if (existing) throw new AppError('User already exists with this email', 409);
    user.email = data.email.toLowerCase();
  }

  if (data.fullName !== undefined) {
    user.name = data.fullName;
    user.fullName = data.fullName;
  }
  ['phone', 'role', 'isActive'].forEach((field) => {
    if (data[field] !== undefined) user[field] = data[field];
  });
  await user.save();
  return sanitizeUser(user);
};

const deleteStaff = async (companyId, userId, currentUserId) => {
  if (userId === currentUserId) throw new AppError('You cannot delete your own account', 400);
  const user = await User.findOneAndDelete({ _id: userId, companyId });
  if (!user) throw new AppError('User not found', 404);
};

module.exports = { listStaff, createStaff, updateStaff, deleteStaff };
