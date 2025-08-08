const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  // Log the error with stack
  logger.error("Unhandled error: %o", {
    message: err.message,
    stack: err.stack,
  });

  // Default to 500
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};
