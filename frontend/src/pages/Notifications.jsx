import React, { useEffect, useMemo, useState } from 'react';
import {
  FiBell,
  FiSearch,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiX,
  FiAlertTriangle,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiInfo,
} from 'react-icons/fi';

import notificationService from '../services/notificationService';

const Notifications = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError('');

      const data =
        await notificationService.getNotifications();

      setNotifications(data);
    } catch (err) {
      console.error(
        'Failed to load notifications:',
        err
      );

      setError(
        'Unable to load notifications. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalNotifications = notifications.length;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readNotifications = notifications.filter(
    (notification) => notification.isRead
  ).length;

  // ============================================================
  // FILTER NOTIFICATIONS
  // ============================================================

  const filteredNotifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return notifications.filter((notification) => {
      // Status filter
      if (
        filter === 'unread' &&
        notification.isRead
      ) {
        return false;
      }

      if (
        filter === 'read' &&
        !notification.isRead
      ) {
        return false;
      }

      // Search
      if (!query) {
        return true;
      }

      return (
        notification.title
          .toLowerCase()
          .includes(query) ||
        notification.message
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    notifications,
    searchTerm,
    filter,
  ]);

  // ============================================================
  // NOTIFICATION ICON
  // ============================================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'low_stock':
        return {
          icon: FiAlertTriangle,
          container:
            'bg-amber-50 text-amber-600',
        };

      case 'out_of_stock':
        return {
          icon: FiPackage,
          container:
            'bg-red-50 text-red-600',
        };

      case 'purchase':
        return {
          icon: FiShoppingCart,
          container:
            'bg-blue-50 text-blue-600',
        };

      case 'sale':
        return {
          icon: FiDollarSign,
          container:
            'bg-emerald-50 text-emerald-600',
        };

      default:
        return {
          icon: FiInfo,
          container:
            'bg-slate-100 text-slate-600',
        };
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    return new Date(date).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    );
  };

  // ============================================================
  // MARK AS READ
  // ============================================================

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        'Failed to mark notification as read:',
        err
      );
    }
  };

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error(
        'Failed to mark all notifications as read:',
        err
      );
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(
        id
      );

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.id !== id
        )
      );
    } catch (err) {
      console.error(
        'Failed to delete notification:',
        err
      );
    }
  };

  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  const clearSearch = () => {
    setSearchTerm('');
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          PAGE CONTAINER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBell size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Stay updated with your inventory and business activities.
                </p>
              </div>
            </div>
          </div>

          {unreadNotifications > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FiCheck size={17} />
              Mark all as read
            </button>
          )}
        </div>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Notifications
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalNotifications}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  All notifications
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBell size={22} />
              </div>
            </div>
          </div>

          {/* Unread */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Unread
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {unreadNotifications}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Require your attention
                </p>
              </div>

              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiBell size={22} />

                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Read */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Read
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {readNotifications}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Already reviewed
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={22} />
              </div>
            </div>
          </div>

        </div>

        {/* ====================================================
            MAIN CARD
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div className="border-b border-slate-200 p-4 sm:p-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              {/* Title */}
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Notification Center
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your system notifications.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Search */}
                <div className="relative w-full sm:w-72">

                  <FiSearch
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Search notifications..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      <FiX size={17} />
                    </button>
                  )}

                </div>

                {/* Filter */}
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">

                  <button
                    onClick={() =>
                      setFilter('all')
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      filter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    All
                  </button>

                  <button
                    onClick={() =>
                      setFilter('unread')
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      filter === 'unread'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Unread
                  </button>

                  <button
                    onClick={() =>
                      setFilter('read')
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      filter === 'read'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Read
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          {isLoading ? (

            /* Loading */
            <div className="flex flex-col items-center justify-center px-6 py-20">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading notifications...
              </p>

            </div>

          ) : error ? (

            /* Error */
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <FiAlertTriangle size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Something went wrong
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <button
                onClick={loadNotifications}
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try Again
              </button>

            </div>

          ) : filteredNotifications.length === 0 ? (

            /* Empty */
            <div className="px-6 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiBell size={28} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                No notifications found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                {searchTerm
                  ? 'Try changing your search term.'
                  : filter === 'unread'
                  ? 'You have no unread notifications.'
                  : filter === 'read'
                  ? 'You have no read notifications.'
                  : 'You are all caught up.'}
              </p>

              {(searchTerm ||
                filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}

            </div>

          ) : (

            /* Notification List */
            <div className="divide-y divide-slate-100">

              {filteredNotifications.map(
                (notification) => {
                  const {
                    icon: Icon,
                    container,
                  } = getNotificationIcon(
                    notification.type
                  );

                  return (
                    <div
                      key={notification.id}
                      className={`group flex gap-4 p-4 transition sm:p-5 ${
                        !notification.isRead
                          ? 'bg-blue-50/30'
                          : 'bg-white'
                      } hover:bg-slate-50`}
                    >

                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${container}`}
                      >
                        <Icon size={20} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                                {notification.title}
                              </h3>

                              {!notification.isRead && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                              )}

                            </div>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                              {formatDate(
                                notification.createdAt
                              )}
                            </p>

                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-2 sm:opacity-0 sm:transition sm:group-hover:opacity-100">

                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(
                                    notification.id
                                  )
                                }
                                title="Mark as read"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <FiCheck size={14} />
                                <span className="hidden sm:inline">
                                  Mark read
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDelete(
                                  notification.id
                                )
                              }
                              title="Delete notification"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 size={15} />
                            </button>

                          </div>

                        </div>
                      </div>
                    </div>
                  );
                }
              )}

            </div>
          )}

          {/* ==================================================
              FOOTER
          ================================================== */}

          {!isLoading &&
            !error &&
            filteredNotifications.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">

                <p className="text-sm text-slate-500">
                  Showing{' '}
                  <span className="font-semibold text-slate-700">
                    {filteredNotifications.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-700">
                    {notifications.length}
                  </span>{' '}
                  notifications
                </p>

              </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Notifications;
