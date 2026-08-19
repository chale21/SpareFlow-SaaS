const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode >= 500 ? 'Internal server error' : (err.message || 'Request failed');

  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  } else {
    console.error('Error:', err.message);
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  errorHandler
};
