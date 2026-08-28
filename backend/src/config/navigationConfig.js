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
| Keep all navigation permissions in one place.
|--------------------------------------------------------------------------
*/

export const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: FiHome,
    roles: ['SUPER_ADMIN', 'SHOP_OWNER', 'STAFF'],
  },

  {
    label: 'Inventory',
    path: '/inventory',
    icon: FiPackage,
    roles: ['SHOP_OWNER', 'STAFF'],
  },

  {
    label: 'Categories',
    path: '/categories',
    icon: FiGrid,
    roles: ['SHOP_OWNER'],
  },

  {
    label: 'Suppliers',
    path: '/suppliers',
    icon: FiTruck,
    roles: ['SHOP_OWNER', 'STAFF'],
  },

  {
    label: 'Purchases',
    path: '/purchases',
    icon: FiShoppingCart,
    roles: ['SHOP_OWNER', 'STAFF'],
  },

  {
    label: 'Sales',
    path: '/sales',
    icon: FiDollarSign,
    roles: ['SHOP_OWNER', 'STAFF'],
  },

  {
    label: 'Reports',
    path: '/reports',
    icon: FiBarChart2,
    roles: ['SUPER_ADMIN', 'SHOP_OWNER'],
  },

  {
    label: 'Notifications',
    path: '/notifications',
    icon: FiBell,
    roles: ['SUPER_ADMIN', 'SHOP_OWNER', 'STAFF'],
  },

  {
    label: 'Company Management',
    path: '/company',
    icon: FiBriefcase,
    roles: ['SUPER_ADMIN', 'SHOP_OWNER'],
  },

  {
    label: 'User Management',
    path: '/users',
    icon: FiUsers,
    roles: ['SUPER_ADMIN', 'SHOP_OWNER'],
  },

  {
    label: 'Business Settings',
    path: '/settings',
    icon: FiSettings,
    roles: ['SHOP_OWNER'],
  },
];

/*
|--------------------------------------------------------------------------
| Get Navigation Items For Current Role
|--------------------------------------------------------------------------
*/

export const getNavigationForRole = (role) => {
  if (!role) {
    return [];
  }

  return NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(role)
  );
};