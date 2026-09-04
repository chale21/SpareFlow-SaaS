import React from 'react';
import NotificationBell from '../notifications/NotificationBell';
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
} from 'react-icons/fi';

const Navbar = ({ pageTitle, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <FiMenu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {pageTitle}
          </h2>

          <p className="hidden sm:block text-xs text-slate-500">
            Manage your {pageTitle.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Notifications */}
                   <NotificationBell />

        {/* User */}
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <FiUser size={17} />
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800">
              User
            </p>

            <p className="text-xs text-slate-500">
              Shop Owner
            </p>
          </div>
        </button>

        {/* Logout */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut size={18} />

          <span className="text-sm font-medium">
            Logout
          </span>
        </button>

      </div>
    </header>
  );
};

export default Navbar;
