import React from 'react';
import {
  FiAlertTriangle,
  FiBriefcase,
  FiCheck,
  FiPackage,
  FiShoppingCart,
  FiTrash2,
  FiUserPlus,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';

const notificationStyles = {
  LOW_STOCK: { icon: FiAlertTriangle, style: 'bg-amber-50 text-amber-600', label: 'Low stock' },
  OUT_OF_STOCK: { icon: FiPackage, style: 'bg-red-50 text-red-600', label: 'Out of stock' },
  NEW_COMPANY: { icon: FiBriefcase, style: 'bg-violet-50 text-violet-600', label: 'New company' },
  PURCHASE_CREATED: { icon: FiShoppingCart, style: 'bg-indigo-50 text-indigo-600', label: 'Purchase created' },
  PURCHASE_COMPLETED: { icon: FiShoppingCart, style: 'bg-blue-50 text-blue-600', label: 'Purchase received' },
  SALE_COMPLETED: { icon: FiShoppingCart, style: 'bg-emerald-50 text-emerald-600', label: 'Sale completed' },
  NEW_STAFF: { icon: FiUserPlus, style: 'bg-emerald-50 text-emerald-600', label: 'New staff' },
};

const NotificationItem = ({
  notification,
  onRead,
  onDelete,
  onNavigate,
  compact = false,
}) => {
  const { canMarkReadNotifications, canDeleteNotifications } = usePermissions();
  const { icon: Icon, style, label } = notificationStyles[notification.type] || {
    icon: FiPackage,
    style: 'bg-slate-100 text-slate-600',
    label: 'Update',
  };

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(notification.createdAt));

  const content = (
    <>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900">{notification.title}</h3>
              {!notification.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />}
            </div>
            <p className={`mt-1 text-sm leading-5 text-slate-500 ${compact ? 'line-clamp-2' : ''}`}>
              {notification.message}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium">{label}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={notification.createdAt}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={`group flex gap-3 border-b border-slate-100 p-4 transition hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50/40' : 'bg-white'}`}>
      {notification.link ? (
        <Link
          to={notification.link}
          onClick={() => {
            if (!notification.isRead && canMarkReadNotifications) onRead(notification.id);
            if (onNavigate) onNavigate();
          }}
          className="flex min-w-0 flex-1 gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`${notification.title}: ${notification.message}`}
        >
          {content}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 gap-3">{content}</div>
      )}
      <div className="flex shrink-0 items-start gap-1">
        {!notification.isRead && canMarkReadNotifications && (
          <button
            type="button"
            onClick={() => onRead(notification.id)}
            title="Mark as read"
            aria-label="Mark notification as read"
            className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiCheck size={15} />
          </button>
        )}
        {canDeleteNotifications && <button
          type="button"
          onClick={() => onDelete(notification.id)}
          title="Delete notification"
          aria-label="Delete notification"
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <FiTrash2 size={15} />
        </button>}
      </div>
    </div>
  );
};

export default NotificationItem;
