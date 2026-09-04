const express =
  require('express');

const router =
  express.Router();


const {
  authenticateUser
} = require(
  '../middleware/auth'
);


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

  getStats

);


// ============================================================
// RECENT ACTIVITIES
// ============================================================

router.get(

  '/recent-activities',

  authenticateUser,

  getRecentActivities

);


module.exports =
  router;