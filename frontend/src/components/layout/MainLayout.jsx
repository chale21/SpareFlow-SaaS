import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getNavigationForRole } from '../../config/navigationConfig';
import useAuth from '../../hooks/useAuth';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const { user } = useAuth();

const navigationItems = getNavigationForRole(
  user?.role
);

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/inventory': 'Inventory',
    '/categories': 'Categories',
    '/suppliers': 'Suppliers',
    '/purchases': 'Purchases',
    '/sales': 'Sales',
    '/reports': 'Reports',
    '/settings': 'Settings',
  };

  const currentPage =
    pageTitles[location.pathname] ||
    (location.pathname === '/sales/history'
      ? 'Sales History'
      : location.pathname.startsWith('/sales/')
        ? 'Invoice'
        : 'Dashboard');

  return (
    <div className="app-shell min-h-screen bg-slate-50 flex">

      {/* Reusable Sidebar */}
      <div className="app-chrome">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Reusable Navbar */}
        <div className="app-chrome">
        <Navbar
          pageTitle={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
        />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;