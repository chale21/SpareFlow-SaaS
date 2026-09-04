/**
 * Response Utility
 * 
 * Provides consistent response formatting for all API endpoints.
 * Ensures uniform structure for success and error responses.
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} error - Error details (only in development)
 */
const sendError = (res, message = 'Error', statusCode = 400, error = null) => {
  const response = {
    success: false,
    message
  };

  // Include error details only in development mode
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }

  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * Useful for list endpoints that return many records
 */
const sendPaginatedSuccess = (
  res,
  data = [],
  totalCount = 0,
  page = 1,
  limit = 10,
  message = 'Success'
) => {
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};

/**
 * Send created response (201)
 * Used for POST requests that create new resources
 */
const sendCreated = (res, message = 'Resource created successfully', data = null) => {
  sendSuccess(res, message, data, 201);
};

/**
 * Send bad request error (400)
 */
const sendBadRequest = (res, message = 'Bad request', error = null) => {
  sendError(res, message, 400, error);
};

/**
 * Send unauthorized error (401)
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  sendError(res, message, 401);
};

/**
 * Send forbidden error (403)
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  sendError(res, message, 403);
};

/**
 * Send not found error (404)
 */
const sendNotFound = (res, message = 'Resource not found') => {
  sendError(res, message, 404);
};

/**
 * Send conflict error (409)
 * Used when resource already exists
 */
const sendConflict = (res, message = 'Resource already exists') => {
  sendError(res, message, 409);
};

/**
 * Send validation error (422)
 */
const sendValidationError = (res, errors = [], message = 'Validation failed') => {
  res.status(422).json({
    success: false,
    message,
    errors
  });
};

/**
 * Send internal server error (500)
 */
const sendServerError = (res, message = 'Internal server error', error = null) => {
  sendError(res, message, 500, error);
};

/**
 * Send service unavailable error (503)
 */
const sendServiceUnavailable = (res, message = 'Service temporarily unavailable') => {
  sendError(res, message, 503);
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginatedSuccess,
  sendCreated,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendValidationError,
  sendServerError,
  sendServiceUnavailable
};
