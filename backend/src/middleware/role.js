const { AppError } = require('./errorHandler');

const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Access denied. Super admin privileges required.' });
  }

  next();
};

const isShopOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!['SUPER_ADMIN', 'SHOP_OWNER'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied. Shop owner privileges required.' });
  }

  next();
};

const isCompanyUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!['SUPER_ADMIN', 'SHOP_OWNER', 'STAFF'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  next();
};

const isStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (req.user.role !== 'STAFF') {
    return res.status(403).json({ success: false, message: 'Access denied. Staff privileges required.' });
  }

  next();
};

module.exports = {
  isSuperAdmin,
  isShopOwner,
  isCompanyUser,
  isStaff,
  AppError
};