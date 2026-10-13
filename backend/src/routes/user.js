const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { filterByCompany } = require('../middleware/tenant');
const { isCompanyUser, isShopOwner } = require('../middleware/role');
const {
  requirePermission,
  requirePermissionForBodyField,
  preventSelfModification
} = require('../middleware/permissions');
const { validateAddStaff, validateUpdateStaff, validateMongoId } = require('../middleware/validate');
const userController = require('../controllers/userController');

router.use(authenticateUser, filterByCompany);
router.get('/', isCompanyUser, requirePermission('staff.view'), userController.listStaff);
router.post(
  '/',
  isCompanyUser,
  requirePermission('staff.create'),
  requirePermissionForBodyField('permissions', 'staff.permissions.manage'),
  (req, res, next) => req.body.permissions === undefined ? next() : isShopOwner(req, res, next),
  validateAddStaff,
  userController.createStaff
);

const requireStaffProfileUpdate = (req, res, next) => {
  const profileFields = Object.keys(req.body || {}).filter(
    (field) => !['isActive', 'permissions'].includes(field)
  );
  if (profileFields.length === 0) return next();
  return requirePermission('staff.update')(req, res, next);
};

router.put(
  '/:id',
  isCompanyUser,
  requireStaffProfileUpdate,
  requirePermissionForBodyField('isActive', 'staff.activate'),
  requirePermissionForBodyField('permissions', 'staff.permissions.manage'),
  (req, res, next) => req.body.permissions === undefined ? next() : isShopOwner(req, res, next),
  preventSelfModification,
  validateUpdateStaff,
  userController.updateStaff
);

router.delete(
  '/:id',
  isCompanyUser,
  requirePermission('staff.delete'),
  preventSelfModification,
  validateMongoId(),
  userController.deleteStaff
);

module.exports = router;