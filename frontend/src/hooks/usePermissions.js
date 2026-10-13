import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  canManagePermissions,
  isStaff,
  isShopOwner,
  isSuperAdmin
} from '../utils/permissions';

/**
 * Custom hook for permission checking
 * Provides easy access to permission utilities based on current user
 */
const usePermissions = () => {
  const { user } = useContext(AuthContext);

  return {
    user,
    
    // Permission checking functions
    hasPermission: (permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
    
    // Get user's permissions
    permissions: getUserPermissions(user),
    
    // Role checking
    canManagePermissions: canManagePermissions(user),
    isStaff: isStaff(user),
    isShopOwner: isShopOwner(user),
    isSuperAdmin: isSuperAdmin(user),
    
    // Convenience methods for common checks
    canViewDashboard: hasPermission(user, 'dashboard.view'),
    canViewProducts: hasPermission(user, 'products.view'),
    canCreateProducts: hasPermission(user, 'products.create'),
    canUpdateProducts: hasPermission(user, 'products.update'),
    canDeleteProducts: hasPermission(user, 'products.delete'),
    
    canViewCategories: hasPermission(user, 'categories.view'),
    canCreateCategories: hasPermission(user, 'categories.create'),
    canUpdateCategories: hasPermission(user, 'categories.update'),
    canDeleteCategories: hasPermission(user, 'categories.delete'),
    
    canViewSuppliers: hasPermission(user, 'suppliers.view'),
    canCreateSuppliers: hasPermission(user, 'suppliers.create'),
    canUpdateSuppliers: hasPermission(user, 'suppliers.update'),
    canDeleteSuppliers: hasPermission(user, 'suppliers.delete'),
    
    canViewPurchases: hasPermission(user, 'purchases.view'),
    canCreatePurchases: hasPermission(user, 'purchases.create'),
    canUpdatePurchases: hasPermission(user, 'purchases.update'),
    canDeletePurchases: hasPermission(user, 'purchases.delete'),
    canReceivePurchases: hasPermission(user, 'purchases.receive'),
    
    canViewSales: hasPermission(user, 'sales.view'),
    canCreateSales: hasPermission(user, 'sales.create'),
    canUpdateSales: hasPermission(user, 'sales.update'),
    canCancelSales: hasPermission(user, 'sales.cancel'),
    
    canViewInventory: hasPermission(user, 'inventory.view'),
    canCreateInventory: hasPermission(user, 'inventory.create'),
    canDeleteInventory: hasPermission(user, 'inventory.delete'),
    canEditInventory: hasPermission(user, 'inventory.edit'),
    canAdjustInventory: hasPermission(user, 'inventory.adjust'),
    canViewStockMovements: hasPermission(user, 'stockMovements.view'),
    
    canViewNotifications: hasPermission(user, 'notifications.view'),
    canMarkReadNotifications: hasPermission(user, 'notifications.markRead'),
    canMarkAllReadNotifications: hasPermission(user, 'notifications.markAllRead'),
    canDeleteNotifications: hasPermission(user, 'notifications.delete'),
    
    canViewStaff: hasPermission(user, 'staff.view'),
    canCreateStaff: hasPermission(user, 'staff.create'),
    canUpdateStaff: hasPermission(user, 'staff.update'),
    canDeleteStaff: hasPermission(user, 'staff.delete'),
    canActivateStaff: hasPermission(user, 'staff.activate'),
    canManageStaffPermissions: hasPermission(user, 'staff.permissions.manage'),
    
    canViewReports: hasPermission(user, 'reports.view'),
  };
};

export default usePermissions;
