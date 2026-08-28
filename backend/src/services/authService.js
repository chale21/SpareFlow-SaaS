const crypto = require('crypto');
const Company = require('../models/Company');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const { createAuthTokens, generateResetToken, verifyToken } = require('../utils/generateToken');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const publicUser = (user, company = user.companyId) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  companyId: company?._id || user.companyId,
  companyName: company?.name,
  isActive: user.isActive
});

const tokensFor = (user, company) => createAuthTokens(
  user._id.toString(),
  user.email,
  company._id.toString(),
  user.role,
  user.fullName
);

const register = async ({ companyName, ownerName, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const [existingCompany, existingUser] = await Promise.all([
    Company.findOne({ name: { $regex: `^${escapeRegex(companyName.trim())}$`, $options: 'i' } }),
    User.findOne({ email: normalizedEmail })
  ]);

  if (existingCompany) throw new AppError('Company name already exists', 409);
  if (existingUser) throw new AppError('User already exists with this email', 409);

  const company = await Company.create({
    name: companyName,
    contactName: ownerName,
    contactEmail: normalizedEmail,
    status: 'ACTIVE'
  });

  try {
    const user = await User.create({
      companyId: company._id,
      fullName: ownerName,
      email: normalizedEmail,
      password,
      role: 'SHOP_OWNER'
    });

    return { user: publicUser(user, company), company, tokens: tokensFor(user, company) };
  } catch (error) {
    await Company.deleteOne({ _id: company._id });
    throw error;
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Your account is inactive. Please contact support.', 403);

  const company = await Company.findById(user.companyId);
  if (!company || company.status !== 'ACTIVE') {
    throw new AppError('Your company account is inactive. Please contact support.', 403);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  return { user: publicUser(user, company), company, tokens: tokensFor(user, company) };
};

const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch (error) {
    throw new AppError(error.message, 401);
  }
  if (decoded.type !== 'refresh') throw new AppError('Invalid refresh token', 401);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new AppError('User account is unavailable', 401);
  const company = await Company.findById(user.companyId);
  if (!company || company.status !== 'ACTIVE') throw new AppError('Company account is unavailable', 401);
  return tokensFor(user, company);
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetTokenHash +passwordResetExpires');
  const result = { message: 'If an account exists for this email, a reset token has been generated.' };
  if (!user) return result;

  const token = generateResetToken(user._id.toString(), user.email);
  user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  if (process.env.NODE_ENV !== 'production') result.resetToken = token;
  return result;
};

const resetPassword = async (token, password) => {
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    throw new AppError(error.message, 400);
  }
  if (decoded.type !== 'password_reset') throw new AppError('Invalid password reset token', 400);

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    _id: decoded.id,
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() }
  }).select('+passwordResetTokenHash +passwordResetExpires');
  if (!user) throw new AppError('Password reset token is invalid or expired', 400);

  user.password = password;
  user.clearPasswordReset();
  await user.save();
  return publicUser(user);
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('companyId');
  if (!user) throw new AppError('User not found', 404);
  return publicUser(user, user.companyId);
};

module.exports = { register, login, refresh, requestPasswordReset, resetPassword, getProfile };