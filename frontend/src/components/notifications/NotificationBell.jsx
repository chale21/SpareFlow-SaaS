import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import notificationService from '../../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import usePermissions from '../../hooks/usePermissions';

const REFRESH_INTERVAL = 20000;

const NotificationBell = () => {
  const { canViewNotifications } = usePermissions();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!canViewNotifications) return;
    try {
      const result = await notificationService.getNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      setError('');
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [canViewNotifications]);

  useEffect(() => {
    if (!canViewNotifications) return undefined;
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, REFRESH_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [canViewNotifications, loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((current) => current.map((notification) => (
        notification.id === id ? { ...notification, isRead: true } : notification
      )));
      setUnreadCount((count) => Math.max(0, count - 1));
      setError('');
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not mark notification as read.');
    }
  };

  const handleDelete = async (id) => {
    const notification = notifications.find((item) => item.id === id);
    try {
      await notificationService.deleteNotification(id);
      setNotifications((current) => current.filter((item) => item.id !== id));
      if (notification && !notification.isRead) setUnreadCount((count) => Math.max(0, count - 1));
      setError('');
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not delete notification.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
      setError('');
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not mark notifications as read.');
    }
  };

  if (!canViewNotifications) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          if (nextOpen) loadNotifications();
        }}
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          error={error}
          onRetry={loadNotifications}
          onRead={handleRead}
          onDelete={handleDelete}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
