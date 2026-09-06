const notificationService = {
  getNotifications: async () => [],
  getUnreadCount: async () => 0,
  markAsRead: async () => ({ success: false, message: 'Notifications are not available from the backend.' }),
  markAllAsRead: async () => ({ success: false, message: 'Notifications are not available from the backend.' }),
  deleteNotification: async () => ({ success: false, message: 'Notifications are not available from the backend.' }),
};

export default notificationService;
