import {
  FiHome,
  FiPackage,
  FiGrid,
  FiTruck,
  FiShoppingCart,
  FiDollarSign,
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiUsers,
  FiSettings,
} from 'react-icons/fi';

/*
|--------------------------------------------------------------------------
| Role-Based Navigation Configuration
|--------------------------------------------------------------------------
|
| SpareFlow roles:
|
| SUPER_ADMIN
| SHOP_OWNER
| STAFF
|
|--------------------------------------------------------------------------
*/

export const NAVIGATION_ITEMS = [

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: FiHome,
    roles: [
      'SUPER_ADMIN',
      'SHOP_OWNER',
      'STAFF',
    ],
  },

  // ==========================================================
  // INVENTORY
  // ==========================================================

  {
    label: 'Inventory',
    path: '/inventory',
    icon: FiPackage,
    roles: [
      'SHOP_OWNER',
      'STAFF',
    ],
  },

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  {
    label: 'Categories',
    path: '/categories',
    icon: FiGrid,
    roles: [
      'SHOP_OWNER',
    ],
  },

  // ==========================================================
  // SUPPLIERS
  // ==========================================================

  {
    label: 'Suppliers',
    path: '/suppliers',
    icon: FiTruck,
    roles: [
      'SHOP_OWNER',
      'STAFF',
    ],
  },

  // ==========================================================
  // PURCHASES
  // ==========================================================

  {
    label: 'Purchases',
    path: '/purchases',
    icon: FiShoppingCart,
    roles: [
      'SHOP_OWNER',
      'STAFF',
    ],
  },

  // ==========================================================
  // SALES
  // ==========================================================

  {
    label: 'Sales',
    path: '/sales',
    icon: FiDollarSign,
    roles: [
      'SHOP_OWNER',
      'STAFF',
    ],
  },

  // ==========================================================
  // REPORTS
  // ==========================================================

  {
    label: 'Reports',
    path: '/reports',
    icon: FiBarChart2,
    roles: [
      'SUPER_ADMIN',
      'SHOP_OWNER',
    ],
  },

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  {
    label: 'Notifications',
    path: '/notifications',
    icon: FiBell,
    roles: [
      'SUPER_ADMIN',
      'SHOP_OWNER',
      'STAFF',
    ],
  },

  // ==========================================================
  // COMPANY MANAGEMENT
  // ==========================================================

  {
    label: 'Company Management',
    path: '/company',
    icon: FiBriefcase,
    roles: [
      'SUPER_ADMIN',
      'SHOP_OWNER',
    ],
  },

  // ==========================================================
  // USER MANAGEMENT
  // ==========================================================

  {
    label: 'User Management',
    path: '/users',
    icon: FiUsers,
    roles: [
      'SUPER_ADMIN',
      'SHOP_OWNER',
    ],
  },

  // ==========================================================
  // SETTINGS
  // ==========================================================

  {
    label: 'Business Settings',
    path: '/settings',
    icon: FiSettings,
    roles: [
      'SHOP_OWNER',
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Get Navigation For Current Role
|--------------------------------------------------------------------------
*/

export const getNavigationForRole = (
  role
) => {

  if (!role) {
    return [];
  }

  return NAVIGATION_ITEMS.filter(
    (item) =>
      item.roles.includes(role)
  );
};