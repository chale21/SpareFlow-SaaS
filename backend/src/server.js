/**
 * SpareFlow Backend API Server
 * 
 * Main entry point for the Express application.
 * Initializes middleware, routes, database, and error handling.
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Import configuration
const { initializeEnv, getEnvConfig } = require('./config/env');
const { connectDB } = require('./config/database');

// Import middleware
const { errorHandler, notFound, validateRequest } = require('./middleware/errorHandler');
const { createSecurityMiddleware } = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');
const purchaseRoutes = require('./routes/purchase');
const salesRoutes = require('./routes/sales');
const reportRoutes = require('./routes/report');
const dashboardRoutes = require('./routes/dashboard');
const stockMovementRoutes = require('./routes/stockMovement');

// Import logger
const logger = require('./utils/logger');

// Initialize environment variables
initializeEnv();
const config = getEnvConfig();

// Initialize Express app
const app = express();
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SpareFlow Backend API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});
// ========================
// SECURITY MIDDLEWARE
// ========================

createSecurityMiddleware(config).forEach((middleware) => app.use(middleware));

// ========================
// LOGGING MIDDLEWARE
// ========================

if (config.enableLogging) {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// ========================
// BODY PARSING MIDDLEWARE
// ========================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Validate request
app.use(validateRequest);

// ========================
// DATABASE CONNECTION
// ========================

// Connect to MongoDB only when this file is executed as the application entry point.
let dbConnected = false;

// ========================
// API ROUTES
// ========================

// Root API endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'SpareFlow API v1',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SpareFlow API is running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: process.uptime()
  });
});

// Authentication routes
app.use('/api/v1/auth', authRoutes);

// Company routes
app.use('/api/v1/companies', companyRoutes);

// User management routes
app.use('/api/v1/users', userRoutes);

// Category routes
app.use('/api/v1/categories', categoryRoutes);

// Product/Inventory routes
app.use('/api/v1/products', productRoutes);

// Supplier routes
app.use('/api/v1/suppliers', supplierRoutes);

// Purchase routes
app.use('/api/v1/purchases', purchaseRoutes);

// Sales routes
app.use('/api/v1/sales', salesRoutes);

// Report routes
app.use('/api/v1/reports', reportRoutes);

// Dashboard routes
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/stock-movements', stockMovementRoutes);

// ========================
// ERROR HANDLING
// ========================

// 404 Handler - Must be before global error handler
app.use(notFound);

// Global error handler - Must be last
app.use(errorHandler);

// ========================
// SERVER STARTUP
// ========================

const PORT = config.port;
let server;

const startServer = async () => {
  try {
    await connectDB();
    dbConnected = true;
    logger.info('Database connection established successfully');

    server = app.listen(PORT, () => {
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: config.nodeEnv,
        nodeVersion: process.version,
        mongodb: `Connected to ${config.mongoUri?.substring(0, 20)}...`
      });

      console.log(`
╔════════════════════════════════════════╗
║       SpareFlow Backend API            ║
║       Server Running                   ║
╠════════════════════════════════════════╣
║  Port:       ${PORT}                    ║
║  Environment: ${config.nodeEnv}                 ║
║  Database:   Connected                 ║
║  API URL:    http://localhost:${PORT}   ║
╚════════════════════════════════════════╝
  `);
    });
  } catch (error) {
    logger.error('Failed to connect to database', error);
    process.exit(1);
  }
};

// ========================
// GRACEFUL SHUTDOWN
// ========================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at Promise', reason);
  console.error('Promise:', promise);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

// Handle server shutdown
const gracefulShutdown = () => {
  logger.info('Graceful shutdown initiated');

  if (!server) {
    process.exit(0);
  }
  
  server.close(() => {
    logger.info('Server closed');
    
    // Close database connection
    mongoose.connection.close(false)
      .then(() => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Error closing MongoDB connection', error);
        process.exit(1);
      });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000); // 10 seconds timeout
  });
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

if (require.main === module) {
  startServer();
}

module.exports = app;

module.exports = app;