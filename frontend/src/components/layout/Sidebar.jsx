import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/inventory', label: 'Inventory', icon: '📦' },
  { path: '/categories', label: 'Categories', icon: '🏷️' },
  { path: '/suppliers', label: 'Suppliers', icon: '🚚' },
  { path: '/purchases', label: 'Purchases', icon: '🛒' },
  { path: '/sales', label: 'Sales', icon: '💵' },
  { path: '/stock-movements', label: 'Stock Movements', icon: '🔄' },
  { path: '/reports', label: 'Reports', icon: '📈' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen">
      <div className="p-6 border-b">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <h1 className="text-xl font-bold text-blue-600">SpareFlow</h1>
        </Link>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Link
          to="/admin"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span>🛡️</span>
          <span>Admin Panel</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
export { menuItems };
