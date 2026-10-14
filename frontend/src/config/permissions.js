/**
 * Frontend Permission Configuration
 * 
 * This file defines permission groups for the UI.
 * Must match the backend permission structure.
 */

export const PERMISSION_GROUPS = {
  dashboard: {
    label: 'Dashboard',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard' }
    ]
  },
  
  products: {
    label: 'Products',
    permissions: [
      { key: 'products.view', label: 'View Products' },
      { key: 'products.create', label: 'Create Products' },
      { key: 'products.update', label: 'Update Products' },
      { key: 'products.delete', label: 'Delete Products' }
    ]
  },
  
  categories: {
    label: 'Categories',
    permissions: [
      { key: 'categories.view', label: 'View Categories' },
      { key: 'categories.create', label: 'Create Categories' },
      { key: 'categories.update', label: 'Update Categories' },
      { key: 'categories.delete', label: 'Delete Categories' }
    ]
  },
  
  suppliers: {
    label: 'Suppliers',
    permissions: [
      { key: 'suppliers.view', label: 'View Suppliers' },
      { key: 'suppliers.create', label: 'Create Suppliers' },
      { key: 'suppliers.update', label: 'Update Suppliers' },
      { key: 'suppliers.delete', label: 'Delete Suppliers' }
    ]
  },
  
  purchases: {
    label: 'Purchases',
    permissions: [
      { key: 'purchases.view', label: 'View Purchases' },
      { key: 'purchases.create', label: 'Create Purchases' },
      { key: 'purchases.update', label: 'Update Purchases' },
      { key: 'purchases.delete', label: 'Delete Purchases' },
      { key: 'purchases.receive', label: 'Receive Purchases' }
    ]
  },
  
  sales: {
    label: 'Sales',
    permissions: [
      { key: 'sales.view', label: 'View Sales' },
      { key: 'sales.create', label: 'Create Sales' },
      { key: 'sales.update', label: 'Update Sales' },
      { key: 'sales.cancel', label: 'Cancel Sales' }
    ]
  },
  
  inventory: {
    label: 'Inventory Management',
    permissions: [
      { key: 'inventory.view', label: 'View Inventory' },
      { key: 'inventory.create', label: 'Add to Inventory' },
      { key: 'inventory.adjust', label: 'Adjust Stock Quantities' },
      { key: 'inventory.delete', label: 'Remove from Inventory' },
      { key: 'inventory.edit', label: 'Edit Inventory' }
    ]
  },
  
  stockMovements: {
    label: 'Stock Movements',
    permissions: [
      { key: 'stockMovements.view', label: 'View Stock Movements' }
    ]
  },
  
  notifications: {
    label: 'Notifications',
    permissions: [
      { key: 'notifications.view', label: 'View Notifications' },
      { key: 'notifications.markRead', label: 'Mark as Read' },
      { key: 'notifications.markAllRead', label: 'Mark All as Read' },
      { key: 'notifications.delete', label: 'Delete Notifications' }
    ]
  },
  
  staff: {
    label: 'User Management',
    permissions: [
      { key: 'staff.view', label: 'View Staff' },
      { key: 'staff.create', label: 'Create Staff' },
      { key: 'staff.update', label: 'Update Staff' },
      { key: 'staff.delete', label: 'Delete Staff' },
      { key: 'staff.activate', label: 'Activate/Deactivate Staff' },
      { key: 'staff.permissions.manage', label: 'Manage Permissions' }
    ]
  },
};

/**
 * Get all permission keys as a flat array
 */
export const getAllPermissionKeys = () => {
  return Object.values(PERMISSION_GROUPS).flatMap(
    group => group.permissions.map(p => p.key)
  );
};
