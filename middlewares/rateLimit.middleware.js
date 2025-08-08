const rateLimit = require("express-rate-limit");

const createRateLimiter = (options) => rateLimit(options);

const authSensitiveLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authSensitiveLimiter, createRateLimiter };
