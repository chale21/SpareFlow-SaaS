const express =
  require('express');

const router =
  express.Router();


const {
  authenticateUser
} = require(
  '../middleware/auth'
);

const { filterByCompany } = require('../middleware/tenant');
const { requirePermission } = require('../middleware/permissions');

const {

  getStats,

  getRecentActivities

} = require(
  '../controllers/dashboardController'
);


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

router.get(

  '/stats',

  authenticateUser,
  filterByCompany,
  requirePermission('dashboard.view'),

  getStats

);


// ============================================================
// RECENT ACTIVITIES
// ============================================================

router.get(

  '/recent-activities',

  authenticateUser,
  filterByCompany,
  requirePermission('dashboard.view'),

  getRecentActivities

);


module.exports =
  router;