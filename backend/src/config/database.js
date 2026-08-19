const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Database Connection Configuration
 * 
 * Handles MongoDB connection setup, error handling, and graceful shutdown.
 * Ensures reliable database connectivity and automatic reconnection on failure.
 */

/**
 * Connect to MongoDB
 * @returns {Promise} MongoDB connection
 */
const connectDB = async () => {
  try {
    // Validate MongoDB URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      // Timeout settings
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // Automatic reconnection
      retryWrites: true,
      retryReads: true,
      // Application name for MongoDB monitoring
      appName: 'SpareFlow-Backend'
    });

    logger.info('MongoDB Connected', {
      host: conn.connection.host,
      database: conn.connection.name,
      port: conn.connection.port
    });

    // Setup connection event listeners
    setupConnectionListeners();

    // Setup graceful shutdown
    setupGracefulShutdown();

    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB', error, {
      mongoUri: process.env.MONGO_URI?.substring(0, 20) + '...' // Log partial URI for security
    });
    
    // Exit process if unable to connect to database
    process.exit(1);
  }
};

/**
 * Setup connection event listeners
 */
const setupConnectionListeners = () => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
};

/**
 * Setup graceful shutdown
 * Closes database connection when application terminates
 */
const setupGracefulShutdown = () => {
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing MongoDB connection', error);
      process.exit(1);
    }
  });

  process.on('SIGTERM', async () => {
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through SIGTERM');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing MongoDB connection', error);
      process.exit(1);
    }
  });
};

/**
 * Check database connection status
 * @returns {boolean} True if connected, false otherwise
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database statistics
 * @returns {Object} Database stats
 */
const getConnectionStats = () => {
  return {
    connected: isConnected(),
    host: mongoose.connection.host,
    database: mongoose.connection.name,
    port: mongoose.connection.port,
    readyState: mongoose.connection.readyState
  };
};

module.exports = {
  connectDB,
  isConnected,
  getConnectionStats
};