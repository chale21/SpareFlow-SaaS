import api from './api';

const noCache = {
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
};

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications', noCache);
    return response.data.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count', noCache);
    return response.data.data.unreadCount;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
