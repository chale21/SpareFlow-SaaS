import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from './Sidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = menuItems.find((item) => item.path === location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentPage ? currentPage.label : 'Dashboard'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg hover:text-gray-900 transition-colors"
          >
            <span>🔔</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
              U
            </div>
            <span className="text-sm text-gray-700 hidden md:inline">User</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
