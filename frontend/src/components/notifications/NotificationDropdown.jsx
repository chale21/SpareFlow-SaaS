import React from 'react';
import {
  FiBell,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({
  notifications,
  onRead,
  onDelete,
  onMarkAllRead,
  onClose,
}) => {
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:w-96">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Notifications
            </h2>

            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Stay updated with your inventory.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
              onDelete={onDelete}
              compact
            />
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FiBell size={21} />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No notifications
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              You're all caught up.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50">
          <Link
            to="/notifications"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View all notifications
            <FiArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;