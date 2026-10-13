const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { isCompanyUser, isSuperAdmin } = require('../middleware/role');
const { requirePermission } = require('../middleware/permissions');
const notificationController = require('../controllers/notificationController');

const router = express.Router();
router.use((req, res, next) => {
  delete req.headers['if-none-match'];
  delete req.headers['if-modified-since'];
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });
  next();
});
router.use(authenticateUser);

router.get('/', (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') return isSuperAdmin(req, res, next);
  return isCompanyUser(req, res, next);
}, requirePermission('notifications.view'), notificationController.list);
router.get('/unread-count', (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') return isSuperAdmin(req, res, next);
  return isCompanyUser(req, res, next);
}, requirePermission('notifications.view'), notificationController.unreadCount);
router.patch('/read-all', (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') return isSuperAdmin(req, res, next);
  return isCompanyUser(req, res, next);
}, requirePermission('notifications.markAllRead'), notificationController.markAllAsRead);
router.patch('/:id/read', (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') return isSuperAdmin(req, res, next);
  return isCompanyUser(req, res, next);
}, requirePermission('notifications.markRead'), notificationController.markAsRead);
router.delete('/:id', (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') return isSuperAdmin(req, res, next);
  return isCompanyUser(req, res, next);
}, requirePermission('notifications.delete'), notificationController.remove);

module.exports = router;
