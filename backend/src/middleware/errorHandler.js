/**
 * Central Error Handling Middleware
 */

class AppError extends Error {
  constructor(message, status = 500) {
    super(message);

    this.status = status;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Catch errors from async functions
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 middleware
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on this server`,
    404
  );

  next(error);
};

/**
 * Basic request validation middleware
 */
const validateRequest = (req, res, next) => {
  try {
    if (
      req.body &&
      typeof req.body !== 'object'
    ) {
      throw new AppError(
        'Request body must be valid JSON',
        400
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // MongoDB invalid ID
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  // MongoDB duplicate field
  if (err.code === 11000) {
    const field = err.keyValue
      ? Object.keys(err.keyValue)[0]
      : 'Field';

    status = 409;
    message = `${field} already exists`;
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    status = 400;

    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token has expired';
  }

  // Multer errors
  if (err.name === 'MulterError') {
    status = 400;
    message = 'File upload error';
  }

  const response = {
    success: false,
    message
  };
  
  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = {
  errorHandler,
  notFound,
  validateRequest,
  AppError,
  catchAsync
};