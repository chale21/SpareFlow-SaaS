import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiBell, FiCheck, FiRefreshCw, FiSearch } from 'react-icons/fi';
import NotificationItem from '../components/notifications/NotificationItem';
import notificationService from '../services/notificationService';
import usePermissions from '../hooks/usePermissions';

const REFRESH_INTERVAL = 20000;

const Notifications = () => {
  const { canMarkAllReadNotifications } = usePermissions();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    try {
      const result = await notificationService.getNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      setError('');
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Unable to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, REFRESH_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [loadNotifications]);

  const filteredNotifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return notifications.filter((notification) => {
      if (filter === 'unread' && notification.isRead) return false;
      if (filter === 'read' && !notification.isRead) return false;
      return !query || `${notification.title} ${notification.message}`.toLowerCase().includes(query);
    });
  }, [filter, notifications, searchTerm]);

  const markAsRead = async (id) => {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || notification.isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
      setError('');
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not mark notification as read.');
    }
  };

  const deleteNotification = async (id) => {
    const notification = notifications.find((item) => item.id === id);
    try {
      await notificationService.deleteNotification(id);
      setNotifications((items) => items.filter((item) => item.id !== id));
      if (notification && !notification.isRead) setUnreadCount((count) => Math.max(0, count - 1));
      setError('');
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not delete notification.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
      setError('');
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not mark notifications as read.');
    }
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FiBell size={22} /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">Important updates from your SpareFlow workspace.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={loadNotifications} aria-label="Refresh notifications" className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <FiRefreshCw size={15} /> <span className="sm:inline">Refresh</span>
          </button>
          {canMarkAllReadNotifications && unreadCount > 0 && (
            <button type="button" onClick={markAllAsRead} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              <FiCheck size={16} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Recent notifications</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{notifications.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Unread</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{unreadCount}</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
          <label htmlFor="notification-search" className="sr-only">Search notifications</label>
          <div className="relative">
            <FiSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="notification-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Notification center</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest updates, newest first.</p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {['all', 'unread', 'read'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${filter === value ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <span className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading notifications...</p>
          </div>
        ) : error && notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button type="button" onClick={loadNotifications} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Try again</button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400"><FiBell size={24} /></div>
            <h3 className="mt-4 font-semibold text-slate-900">No notifications found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {error || (searchTerm ? 'Try a different search.' : 'You’re all caught up. New updates will appear here.')}
            </p>
          </div>
        ) : (
          <div>
            {error && <p role="alert" className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
            {filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onRead={markAsRead} onDelete={deleteNotification} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notifications;
