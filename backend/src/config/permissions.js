/**
 * Centralized Permission Definitions
 * 
 * This file defines all supported permissions in the SpareFlow system.
 * Permission keys follow the pattern: module.action
 * 
 * Adding new permissions:
 * 1. Add the permission key to the appropriate module group
 * 2. Update the VALID_PERMISSIONS array
 * 3. Apply the permission check in relevant middleware/routes
 * 4. Add UI controls in the User Management permission selector
 */

const PERMISSION_GROUPS = {
  dashboard: {
    label: 'Dashboard',
    permissions: ['dashboard.view']
  },
  
  products: {
    label: 'Products',
    permissions: [
      'products.view',
      'products.create',
      'products.update',
      'products.delete'
    ]
  },
  
  categories: {
    label: 'Categories',
    permissions: [
      'categories.view',
      'categories.create',
      'categories.update',
      'categories.delete'
    ]
  },
  
  suppliers: {
    label: 'Suppliers',
    permissions: [
      'suppliers.view',
      'suppliers.create',
      'suppliers.update',
      'suppliers.delete'
    ]
  },
  
  purchases: {
    label: 'Purchases',
    permissions: [
      'purchases.view',
      'purchases.create',
      'purchases.update',
      'purchases.delete',
      'purchases.receive'
    ]
  },
  
  sales: {
    label: 'Sales',
    permissions: [
      'sales.view',
      'sales.create',
      'sales.update',
      'sales.cancel'
    ]
  },
  
  inventory: {
    label: 'Inventory Management',
    permissions: [
      'inventory.view',
      'inventory.create',
      'inventory.adjust',
      'inventory.delete',
      'inventory.edit'
    ]
  },
  
  stockMovements: {
    label: 'Stock Movements',
    permissions: [
      'stockMovements.view'
    ]
  },
  
  notifications: {
    label: 'Notifications',
    permissions: [
      'notifications.view',
      'notifications.markRead',
      'notifications.markAllRead',
      'notifications.delete'
    ]
  },
  
  staff: {
    label: 'User Management',
    permissions: [
      'staff.view',
      'staff.create',
      'staff.update',
      'staff.delete',
      'staff.activate',
      'staff.permissions.manage'
    ]
  },
  
  reports: {
    label: 'Reports',
    permissions: [
      'reports.view'
    ]
  }
};

/**
 * Flat array of all valid permission keys
 * Used for validation on the backend
 */
const VALID_PERMISSIONS = Object.values(PERMISSION_GROUPS).flatMap(
  group => group.permissions
);

/**
 * Default permissions for each role
 * SUPER_ADMIN and SHOP_OWNER have full access by default
 * STAFF has no permissions by default (must be assigned)
 */
const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: VALID_PERMISSIONS,
  SHOP_OWNER: VALID_PERMISSIONS,
  STAFF: []
};

/**
 * Check if a permission key is valid
 */
const isValidPermission = (permission) => {
  return VALID_PERMISSIONS.includes(permission);
};

/**
 * Validate an array of permission keys
 * Returns { valid: boolean, invalid: string[] }
 */
const validatePermissions = (permissions) => {
  if (!Array.isArray(permissions)) {
    return { valid: false, invalid: [] };
  }
  
  const invalid = permissions.filter(p => !isValidPermission(p));
  return {
    valid: invalid.length === 0,
    invalid
  };
};

/**
 * Get permission details for UI display
 */
const getPermissionGroups = () => {
  return PERMISSION_GROUPS;
};

/**
 * Get all valid permissions
 */
const getAllPermissions = () => {
  return VALID_PERMISSIONS;
};

module.exports = {
  PERMISSION_GROUPS,
  VALID_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  isValidPermission,
  validatePermissions,
  getPermissionGroups,
  getAllPermissions
};
