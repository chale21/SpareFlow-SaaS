/**
 * Permission Middleware
 * 
 * Provides middleware functions for checking user permissions
 * on protected routes and actions.
 */

const User = require('../models/User');
const { DEFAULT_ROLE_PERMISSIONS } = require('../config/permissions');

const hasImplicitPermissions = (user) =>
  user && ['SUPER_ADMIN', 'SHOP_OWNER'].includes(user.role);

/**
 * Load user permissions and add to request object
 * This should be called after authentication middleware
 */
const loadUserPermissions = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (hasImplicitPermissions(req.user)) {
      req.userPermissions = DEFAULT_ROLE_PERMISSIONS[req.user.role];
      return next();
    }

    const user = await User.findById(req.user.id).select('permissions isActive status');
    
    if (!user || user.isActive === false || ['INACTIVE', 'SUSPENDED'].includes(user.status)) {
      return res.status(401).json({
        success: false,
        message: 'User account is unavailable.'
      });
    }

    req.userPermissions = user.permissions || [];
    return next();
  } catch (error) {
    console.error('Error loading user permissions:', error);
    return next(error);
  }
};

const ensurePermissionsLoaded = async (req, res) => {
  if (hasImplicitPermissions(req.user)) {
    req.userPermissions = DEFAULT_ROLE_PERMISSIONS[req.user.role];
    return true;
  }

  if (Array.isArray(req.userPermissions)) return true;

  const user = await User.findById(req.user.id).select('permissions isActive status');
  if (!user || user.isActive === false || ['INACTIVE', 'SUSPENDED'].includes(user.status)) {
    res.status(403).json({
      success: false,
      message: 'Account is deactivated. Contact your administrator.'
    });
    return false;
  }

  req.userPermissions = user.permissions || [];
  return true;
};

/**
 * Check if user has a specific permission
 * @param {string} permission - The permission key to check
 * @returns {Function} Middleware function
 */
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      if (!(await ensurePermissionsLoaded(req, res))) return;

      // Check if user has the required permission
      if (!req.userPermissions || !req.userPermissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${permission}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions.'
      });
    }
  };
};

/**
 * Check if user has any of the specified permissions
 * @param {string[]} permissions - Array of permission keys (user needs at least one)
 * @returns {Function} Middleware function
 */
const requireAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      if (!(await ensurePermissionsLoaded(req, res))) return;

      // Check if user has any of the required permissions
      const hasPermission = permissions.some(perm => 
        req.userPermissions && req.userPermissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required one of: ${permissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions.'
      });
    }
  };
};

/**
 * Check if user has all of the specified permissions
 * @param {string[]} permissions - Array of permission keys (user needs all)
 * @returns {Function} Middleware function
 */
const requireAllPermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      if (!(await ensurePermissionsLoaded(req, res))) return;

      // Check if user has all required permissions
      const hasAllPermissions = permissions.every(perm => 
        req.userPermissions && req.userPermissions.includes(perm)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required all of: ${permissions.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions.'
      });
    }
  };
};

const requirePermissionForBodyField = (field, permission) => (req, res, next) => {
  if (!Object.prototype.hasOwnProperty.call(req.body || {}, field)) return next();
  return requirePermission(permission)(req, res, next);
};

/**
 * Prevent users from modifying their own permissions or role
 * Used in staff update/delete operations
 */
const preventSelfModification = (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    
    if (String(targetUserId) === String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot modify your own account or permissions.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking self-modification.'
    });
  }
};

/**
 * Check if user can manage staff permissions
 * Only SHOP_OWNER with staff.permissions.manage can assign permissions
 */
const canManagePermissions = (req, res, next) => {
  try {
    if (req.user && ['SUPER_ADMIN', 'SHOP_OWNER'].includes(req.user.role)) {
      return next();
    }

    // STAFF can never manage permissions
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only Shop Owners can manage staff permissions.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking permission management access.'
    });
  }
};

module.exports = {
  loadUserPermissions,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requirePermissionForBodyField,
  preventSelfModification,
  canManagePermissions
};
