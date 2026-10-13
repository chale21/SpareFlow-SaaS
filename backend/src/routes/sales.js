const express = require('express');

const router = express.Router();

const {
  authenticateUser
} = require('../middleware/auth');

const { filterByCompany } = require('../middleware/tenant');
const { requirePermission } = require('../middleware/permissions');

const {
  createSale,
  getSales,
  getSalesHistory,
  getInvoice,
  getSalesSummary,
  getDailySales,
  getMonthlySales,
  getTopProducts
} = require('../controllers/salesController');

// ============================================================
// SALES ANALYTICS
// ============================================================

router.get(
  '/analytics/summary',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getSalesSummary
);

router.get(
  '/analytics/daily',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getDailySales
);

router.get(
  '/analytics/monthly',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getMonthlySales
);

router.get(
  '/analytics/top-products',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getTopProducts
);

// ============================================================
// SALES HISTORY
// ============================================================

router.get(
  '/history',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getSalesHistory
);

// ============================================================
// GET ALL SALES
// ============================================================

router.get(
  '/',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getSales
);

// ============================================================
// CREATE SALE
// ============================================================

router.post(
  '/',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.create'),
  createSale
);

// ============================================================
// GET INVOICE
// ============================================================

router.get(
  '/:id/invoice',
  authenticateUser,
  filterByCompany,
  requirePermission('sales.view'),
  getInvoice
);

module.exports = router;