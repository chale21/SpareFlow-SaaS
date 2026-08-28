/**
 * Logging Utility
 * 
 * Provides structured logging for the entire application.
 * Logs are categorized by level: INFO, ERROR, WARN, DEBUG
 * Helps with debugging, monitoring, and audit trails.
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG',
  AUDIT: 'AUDIT'
};

/**
 * Get current timestamp in ISO format
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Format log message with metadata
 */
const formatLog = (level, message, data = {}) => {
  return {
    timestamp: getTimestamp(),
    level,
    message,
    ...data
  };
};

/**
 * Write log to file
 */
const writeToFile = (logData, filename = 'app.log') => {
  try {
    const logPath = path.join(logsDir, filename);
    const logEntry = JSON.stringify(logData) + '\n';
    fs.appendFileSync(logPath, logEntry);
  } catch (error) {
    console.error('Error writing to log file:', error.message);
  }
};

/**
 * Info level logging
 * Used for general application information
 */
const info = (message, data = {}) => {
  const logData = formatLog(LogLevel.INFO, message, data);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${logData.timestamp}] INFO: ${message}`, data);
  }
  
  writeToFile(logData);
};

/**
 * Error level logging
 * Used for error events
 */
const error = (message, error, data = {}) => {
  const errorData = {
    errorMessage: error?.message || error,
    errorStack: error?.stack,
    ...data
  };
  
  const logData = formatLog(LogLevel.ERROR, message, errorData);
  
  console.error(`[${logData.timestamp}] ERROR: ${message}`, error);
  
  writeToFile(logData, 'error.log');
};

/**
 * Warning level logging
 * Used for warning events that should be monitored
 */
const warn = (message, data = {}) => {
  const logData = formatLog(LogLevel.WARN, message, data);
  
  console.warn(`[${logData.timestamp}] WARN: ${message}`, data);
  
  writeToFile(logData);
};

/**
 * Debug level logging
 * Only logged in development mode
 */
const debug = (message, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    const logData = formatLog(LogLevel.DEBUG, message, data);
    console.log(`[${logData.timestamp}] DEBUG: ${message}`, data);
    writeToFile(logData);
  }
};

/**
 * Audit logging
 * Used for tracking important business operations and user activities
 */
const audit = (action, userId, companyId, details = {}) => {
  const logData = formatLog(LogLevel.AUDIT, action, {
    userId,
    companyId,
    details
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${logData.timestamp}] AUDIT: ${action}`, { userId, companyId, details });
  }
  
  writeToFile(logData, 'audit.log');
};

/**
 * Login audit log
 */
const logLogin = (userId, email, companyId) => {
  audit('USER_LOGIN', userId, companyId, { email });
};

/**
 * Logout audit log
 */
const logLogout = (userId, email, companyId) => {
  audit('USER_LOGOUT', userId, companyId, { email });
};

/**
 * Product creation audit log
 */
const logProductCreation = (userId, companyId, productId, productName) => {
  audit('PRODUCT_CREATED', userId, companyId, { productId, productName });
};

/**
 * Product update audit log
 */
const logProductUpdate = (userId, companyId, productId, changes) => {
  audit('PRODUCT_UPDATED', userId, companyId, { productId, changes });
};

/**
 * Sale creation audit log
 */
const logSaleCreation = (userId, companyId, saleId, totalAmount) => {
  audit('SALE_CREATED', userId, companyId, { saleId, totalAmount });
};

/**
 * Purchase creation audit log
 */
const logPurchaseCreation = (userId, companyId, purchaseId, totalAmount) => {
  audit('PURCHASE_CREATED', userId, companyId, { purchaseId, totalAmount });
};

/**
 * Stock adjustment audit log
 */
const logStockAdjustment = (userId, companyId, productId, quantityChange) => {
  audit('STOCK_ADJUSTED', userId, companyId, { productId, quantityChange });
};

/**
 * API request logging (can be used with middleware)
 */
const logRequest = (method, url, statusCode, responseTime) => {
  info(`API Request: ${method} ${url}`, {
    statusCode,
    responseTime: `${responseTime}ms`
  });
};

/**
 * API error logging (can be used with error middleware)
 */
const logAPIError = (method, url, statusCode, error) => {
  error(`API Error: ${method} ${url}`, error, {
    statusCode
  });
};

module.exports = {
  info,
  error,
  warn,
  debug,
  audit,
  logLogin,
  logLogout,
  logProductCreation,
  logProductUpdate,
  logSaleCreation,
  logPurchaseCreation,
  logStockAdjustment,
  logRequest,
  logAPIError,
  LogLevel
};
