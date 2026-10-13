/**
 * Permission Utility Functions
 * 
 * Provides helper functions for checking user permissions
 * on the frontend.
 */

/**
 * Check if user has a specific permission
 * @param {Object} user - User object with role and permissions
 * @param {string} permission - Permission key to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // SUPER_ADMIN and SHOP_OWNER have full access
  if (user.role === 'SUPER_ADMIN' || user.role === 'SHOP_OWNER') {
    return true;
  }
  
  // STAFF must have explicit permission
  if (user.role === 'STAFF') {
    return user.permissions && user.permissions.includes(permission);
  }
  
  return false;
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object with role and permissions
 * @param {string[]} permissions - Array of permission keys
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !permissions || permissions.length === 0) return false;
  
  // SUPER_ADMIN and SHOP_OWNER have full access
  if (user.role === 'SUPER_ADMIN' || user.role === 'SHOP_OWNER') {
    return true;
  }
  
  // STAFF must have at least one of the permissions
  if (user.role === 'STAFF' && user.permissions) {
    return permissions.some(perm => user.permissions.includes(perm));
  }
  
  return false;
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object with role and permissions
 * @param {string[]} permissions - Array of permission keys
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user || !permissions || permissions.length === 0) return false;
  
  // SUPER_ADMIN and SHOP_OWNER have full access
  if (user.role === 'SUPER_ADMIN' || user.role === 'SHOP_OWNER') {
    return true;
  }
  
  // STAFF must have all of the permissions
  if (user.role === 'STAFF' && user.permissions) {
    return permissions.every(perm => user.permissions.includes(perm));
  }
  
  return false;
};

/**
 * Get user's effective permissions
 * @param {Object} user - User object with role and permissions
 * @returns {string[]} Array of permission keys
 */
export const getUserPermissions = (user) => {
  if (!user) return [];
  
  // SUPER_ADMIN and SHOP_OWNER have implicit full access
  // Return empty array as they don't need explicit permissions
  if (user.role === 'SUPER_ADMIN' || user.role === 'SHOP_OWNER') {
    return [];
  }
  
  // STAFF returns their assigned permissions
  return user.permissions || [];
};

/**
 * Check if user can manage staff permissions
 * @param {Object} user - User object with role
 * @returns {boolean}
 */
export const canManagePermissions = (user) => {
  if (!user) return false;
  
  // Only SUPER_ADMIN and SHOP_OWNER can manage permissions
  return user.role === 'SUPER_ADMIN' || user.role === 'SHOP_OWNER';
};

/**
 * Check if user is a staff member
 * @param {Object} user - User object with role
 * @returns {boolean}
 */
export const isStaff = (user) => {
  return user && user.role === 'STAFF';
};

/**
 * Check if user is a shop owner
 * @param {Object} user - User object with role
 * @returns {boolean}
 */
export const isShopOwner = (user) => {
  return user && user.role === 'SHOP_OWNER';
};

/**
 * Check if user is a super admin
 * @param {Object} user - User object with role
 * @returns {boolean}
 */
export const isSuperAdmin = (user) => {
  return user && user.role === 'SUPER_ADMIN';
};
