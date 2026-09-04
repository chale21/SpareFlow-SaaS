/**
 * SpareFlow Environment Configuration
 */

require('dotenv').config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const optionalEnvVars = {
  PORT: 5000,
  CLIENT_URL: 'http://localhost:3000',
  NODE_ENV: 'development',
  LOG_LEVEL: 'info',
  API_VERSION: 'v1'
};

const validateEnv = () => {
  const missing = [];

  requiredEnvVars.forEach((variable) => {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return true;
};

const initializeEnv = () => {
  try {
    validateEnv();
    console.log('Environment variables validated successfully');
  } catch (error) {
    console.error('Environment configuration error:', error.message);
    process.exit(1);
  }
};

const getEnvConfig = () => {
  const nodeEnv =
    process.env.NODE_ENV || optionalEnvVars.NODE_ENV;

  return {
    mongoUri: process.env.MONGO_URI,

    jwtSecret: process.env.JWT_SECRET,

    port: parseInt(
      process.env.PORT || optionalEnvVars.PORT,
      10
    ),

    nodeEnv,

    clientUrl:
      process.env.CLIENT_URL ||
      optionalEnvVars.CLIENT_URL,

    logLevel:
      process.env.LOG_LEVEL ||
      optionalEnvVars.LOG_LEVEL,

    apiVersion:
      process.env.API_VERSION ||
      optionalEnvVars.API_VERSION,

    isDevelopment: nodeEnv === 'development',

    isProduction: nodeEnv === 'production',

    isTest: nodeEnv === 'test',

    enableCORS: process.env.ENABLE_CORS !== 'false',

    enableLogging: process.env.ENABLE_LOGGING !== 'false',

   enableRateLimit: process.env.ENABLE_RATE_LIMIT !== 'false',

rateLimitWindowMs: parseInt(
  process.env.RATE_LIMIT_WINDOW_MS ||
    15 * 60 * 1000,
  10
),

rateLimitMax: parseInt(
  process.env.RATE_LIMIT_MAX ||
    (nodeEnv === 'development' ? 300 : 100),
  10
),
  };
};

module.exports = {
  initializeEnv,
  getEnvConfig,
  validateEnv
};