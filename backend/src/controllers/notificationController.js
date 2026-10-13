const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/response');

const audienceFilter = (user) => {
  if (user.role === 'SUPER_ADMIN') {
    return { recipientId: user.id, companyId: null };
  }
  return { recipientId: user.id, companyId: user.companyId };
};

const list = catchAsync(async (req, res) => {
  const filter = audienceFilter(req.user);
  const [notifications, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).limit(100).lean(),
    Notification.countDocuments({ ...filter, isRead: false })
  ]);

  sendSuccess(res, 'Notifications retrieved successfully', {
    notifications: notifications.map((notification) => ({
      ...notification,
      id: notification._id
    })),
    unreadCount
  });
});

const unreadCount = catchAsync(async (req, res) => {
  const count = await Notification.countDocuments({
    ...audienceFilter(req.user),
    isRead: false
  });
  sendSuccess(res, 'Unread notification count retrieved successfully', { unreadCount: count });
});

const markAsRead = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid notification ID', 400);
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, ...audienceFilter(req.user) },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  sendSuccess(res, 'Notification marked as read', { id: notification._id, isRead: notification.isRead });
});

const markAllAsRead = catchAsync(async (req, res) => {
  const result = await Notification.updateMany(
    { ...audienceFilter(req.user), isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  sendSuccess(res, 'Notifications marked as read', { modifiedCount: result.modifiedCount });
});

const remove = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid notification ID', 400);
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    ...audienceFilter(req.user)
  });
  if (!notification) throw new AppError('Notification not found', 404);
  sendSuccess(res, 'Notification deleted successfully');
});

module.exports = { list, unreadCount, markAsRead, markAllAsRead, remove };
