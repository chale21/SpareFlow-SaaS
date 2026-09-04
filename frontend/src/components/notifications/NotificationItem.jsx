import React from 'react';
import {
  FiAlertTriangle,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiInfo,
  FiCheck,
  FiTrash2,
} from 'react-icons/fi';

const NotificationItem = ({
  notification,
  onRead,
  onDelete,
  compact = false,
}) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'low_stock':
        return {
          icon: FiAlertTriangle,
          style: 'bg-amber-50 text-amber-600',
        };

      case 'out_of_stock':
        return {
          icon: FiPackage,
          style: 'bg-red-50 text-red-600',
        };

      case 'purchase':
        return {
          icon: FiShoppingCart,
          style: 'bg-blue-50 text-blue-600',
        };

      case 'sale':
        return {
          icon: FiDollarSign,
          style: 'bg-emerald-50 text-emerald-600',
        };

      default:
        return {
          icon: FiInfo,
          style: 'bg-slate-100 text-slate-600',
        };
    }
  };

  const { icon: Icon, style } = getNotificationIcon();

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`group flex gap-3 border-b border-slate-100 p-4 transition hover:bg-slate-50 ${
        !notification.isRead ? 'bg-blue-50/40' : 'bg-white'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {notification.title}
              </h3>

              {!notification.isRead && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
              )}
            </div>

            <p
              className={`mt-1 text-sm leading-5 text-slate-500 ${
                compact ? 'line-clamp-2' : ''
              }`}
            >
              {notification.message}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {formatDate(notification.createdAt)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
            {!notification.isRead && (
              <button
                onClick={() => onRead(notification.id)}
                title="Mark as read"
                className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
              >
                <FiCheck size={15} />
              </button>
            )}

            <button
              onClick={() => onDelete(notification.id)}
              title="Delete notification"
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;