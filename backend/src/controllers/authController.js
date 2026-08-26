const authService = require('../services/authService');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess, sendCreated } = require('../utils/response');
const { logLogin, logLogout } = require('../utils/logger');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  logLogin(result.user.id.toString(), result.user.email, result.company._id.toString());
  sendCreated(res, 'Company and owner account created successfully', {
    user: result.user,
    company: { id: result.company._id, name: result.company.name, status: result.company.status },
    token: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    expiresIn: result.tokens.expiresIn
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  logLogin(result.user.id.toString(), result.user.email, result.company._id.toString());
  sendSuccess(res, 'Login successful', {
    token: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    expiresIn: result.tokens.expiresIn,
    user: result.user
  });
});

const refresh = catchAsync(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  sendSuccess(res, 'Access token refreshed', result);
});

const logout = catchAsync(async (req, res) => {
  logLogout(req.user.id, req.user.email, req.user.companyId);
  sendSuccess(res, 'Logout successful');
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);
  sendSuccess(res, result.message, process.env.NODE_ENV === 'production' ? null : { resetToken: result.resetToken });
});

const resetPassword = catchAsync(async (req, res) => {
  const user = await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, 'Password reset successfully. Please log in again.', { user });
});

const profile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  sendSuccess(res, 'Profile retrieved successfully', user);
});

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, profile };