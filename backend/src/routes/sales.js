const express = require('express');

const router = express.Router();

const {
  authenticateUser
} = require('../middleware/auth');


const {

  createSale,

  getSales,

  getSalesHistory,

  getInvoice,

  getSalesSummary,

  getDailySales,

  getMonthlySales,

  getTopProducts

} = require(
  '../controllers/salesController'
);


// ============================================================
// SALES ANALYTICS
// ============================================================

router.get(

  '/analytics/summary',

  authenticateUser,

  getSalesSummary

);


router.get(

  '/analytics/daily',

  authenticateUser,

  getDailySales

);


router.get(

  '/analytics/monthly',

  authenticateUser,

  getMonthlySales

);


router.get(

  '/analytics/top-products',

  authenticateUser,

  getTopProducts

);


// ============================================================
// SALES HISTORY
// ============================================================

router.get(

  '/history',

  authenticateUser,

  getSalesHistory

);


// ============================================================
// GET ALL SALES
// ============================================================

router.get(

  '/',

  authenticateUser,

  getSales

);


// ============================================================
// CREATE SALE
// ============================================================

router.post(

  '/',

  authenticateUser,

  createSale

);


// ============================================================
// GET INVOICE
// ============================================================

router.get(

  '/:id/invoice',

  authenticateUser,

  getInvoice

);

module.exports =
  router;