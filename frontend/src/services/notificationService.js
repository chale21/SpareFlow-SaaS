// frontend/src/services/notificationService.js

const notifications = [
  {
    id: '1',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Brake Pads are running low. Only 5 units remaining.',
    isRead: false,
    createdAt: '2026-08-20T09:30:00',
  },
  {
    id: '2',
    type: 'out_of_stock',
    title: 'Product Out of Stock',
    message: 'Oil Filter is currently out of stock.',
    isRead: false,
    createdAt: '2026-08-20T08:15:00',
  },
  {
    id: '3',
    type: 'purchase',
    title: 'Purchase Received',
    message: 'Purchase order PO-1024 has been received successfully.',
    isRead: true,
    createdAt: '2026-08-19T16:45:00',
  },
  {
    id: '4',
    type: 'sale',
    title: 'Sale Completed',
    message: 'Sale invoice INV-2048 was completed successfully.',
    isRead: true,
    createdAt: '2026-08-19T14:20:00',
  },
  {
    id: '5',
    type: 'system',
    title: 'System Update',
    message: 'SpareFlow has been updated to version 1.0.',
    isRead: true,
    createdAt: '2026-08-18T10:00:00',
  },
];

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const notificationService = {
  getNotifications: async () => {
    await delay();

    return [...notifications];
  },

  getUnreadCount: async () => {
    await delay();

    return notifications.filter(
      (notification) => !notification.isRead
    ).length;
  },

  markAsRead: async (id) => {
    await delay();

    const notification = notifications.find(
      (item) => item.id === id
    );

    if (notification) {
      notification.isRead = true;
    }

    return notification;
  },

  markAllAsRead: async () => {
    await delay();

    notifications.forEach((notification) => {
      notification.isRead = true;
    });

    return [...notifications];
  },

  deleteNotification: async (id) => {
    await delay();

    const index = notifications.findIndex(
      (notification) => notification.id === id
    );

    if (index !== -1) {
      notifications.splice(index, 1);
    }

    return true;
  },
};

export default notificationService;