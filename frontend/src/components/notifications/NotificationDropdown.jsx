import React from 'react';
import { FiArrowRight, FiBell, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import usePermissions from '../../hooks/usePermissions';

const NotificationDropdown = ({
  notifications,
  unreadCount,
  isLoading,
  error,
  onRetry,
  onRead,
  onDelete,
  onMarkAllRead,
  onClose,
}) => {
  const { canMarkAllReadNotifications } = usePermissions();

  return (
  <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:w-96">
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{unreadCount} new</span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">Updates from your SpareFlow workspace.</p>
      </div>
      {canMarkAllReadNotifications && unreadCount > 0 && (
        <button type="button" onClick={onMarkAllRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          Mark all read
        </button>
      )}
    </div>

    <div className="max-h-[420px] overflow-y-auto">
      {isLoading && notifications.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          <span className="mx-auto mb-3 block h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading notifications...
        </div>
      ) : error ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button type="button" onClick={onRetry} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <FiRefreshCw size={14} /> Try again
          </button>
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={onRead}
            onDelete={onDelete}
            onNavigate={onClose}
            compact
          />
        ))
      ) : (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><FiBell size={21} /></div>
          <h3 className="mt-3 text-sm font-semibold text-slate-900">You’re all caught up</h3>
          <p className="mt-1 text-xs text-slate-500">New updates will appear here.</p>
        </div>
      )}
    </div>

    {notifications.length > 0 && (
      <div className="border-t border-slate-200 bg-slate-50">
        <Link to="/notifications" onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
          View all notifications <FiArrowRight size={15} />
        </Link>
      </div>
    )}
  </div>
  );
};

export default NotificationDropdown;
