const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();

  if (!meta || Object.keys(meta).length === 0) {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }

  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(meta)}`;
};

const info = (message, meta) => {
  console.info(formatMessage('info', message, meta));
};

const warn = (message, meta) => {
  console.warn(formatMessage('warn', message, meta));
};

const error = (message, meta) => {
  console.error(formatMessage('error', message, meta));
};

module.exports = {
  info,
  warn,
  error
};
