import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../notifications/NotificationBell';
import {
  FiUser,
  FiLogOut,
  FiMenu,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const Navbar = ({ pageTitle, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const displayName = user?.fullName || user?.name || user?.email || 'Account';
  const roleName = {
    SHOP_OWNER: 'Company Owner',
    STAFF: 'Staff',
    SUPER_ADMIN: 'Super Admin',
  }[user?.role] || 'User';

  useEffect(() => {
    const closeProfileOnOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', closeProfileOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeProfileOnOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((open) => !open)}
            aria-label={`View profile for ${displayName}`}
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {displayName !== 'Account'
                ? displayName.charAt(0).toUpperCase()
                : <FiUser size={17} />}
            </div>
            <div className="hidden text-left md:block">
              <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">{roleName}</p>
            </div>
          </button>

          {isProfileOpen && (
            <section
              aria-label="User profile details"
              className="absolute right-0 top-12 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email || 'Email not available'}</p>
                </div>
              </div>
              <dl className="space-y-2 pt-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Role</dt>
                  <dd className="text-right font-medium text-slate-800">{roleName}</dd>
                </div>
                {user?.phone && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="text-right font-medium text-slate-800">{user.phone}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {user?.status || (user?.isActive === false ? 'INACTIVE' : 'ACTIVE')}
                  </dd>
                </div>
              </dl>
            </section>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 sm:px-3"
          aria-label="Log out"
        >
          <FiLogOut size={18} />
          <span className="hidden text-sm font-medium sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
};

export default Navbar;
