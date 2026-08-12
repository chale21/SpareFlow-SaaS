import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const adminMenu = [
  { path: '/admin', label: 'Overview', icon: '🏠' },
  { path: '/admin/companies', label: 'Companies', icon: '🏢' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/system-logs', label: 'System Logs', icon: '📋' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-slate-800 text-white shadow-lg flex flex-col min-h-screen">
        <div className="p-6 border-b border-slate-700">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-lg font-bold">SpareFlow</h1>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {adminMenu.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <span>↩️</span>
            <span>Back to Shop</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {adminMenu.find((m) => m.path === location.pathname)?.label || 'Admin'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t">
          <div className="px-6 py-4 text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} SpareFlow Platform Administration
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
