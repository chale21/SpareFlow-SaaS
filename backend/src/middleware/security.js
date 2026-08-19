const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const createSecurityMiddleware = (config) => {
  const middleware = [helmet()];

  if (config.enableCORS) {
    middleware.push(cors({
      origin: config.clientUrl,
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Company-ID']
    }));
  }

  if (config.enableRateLimit) {
    middleware.push(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
      }
    }));
  }

  return middleware;
};

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.'
  }
});

module.exports = { createSecurityMiddleware, authRateLimiter };