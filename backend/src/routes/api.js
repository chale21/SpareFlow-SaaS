const express = require('express');
const router = express.Router();

// Mount existing versioned routes here so server.js stays small and routing is centralized
const authRoutes = require('./auth');
const companyRoutes = require('./company');
const userRoutes = require('./user');
const categoryRoutes = require('./category');
const productRoutes = require('./product');
const supplierRoutes = require('./supplier');
const purchaseRoutes = require('./purchase');
const salesRoutes = require('./sales');
const reportRoutes = require('./report');
const dashboardRoutes = require('./dashboard');

// Health endpoint
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'SpareFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount resource routes under /api/v1
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', salesRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
