const rateLimit = require("express-rate-limit");

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 300);

const globalLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Trop de requetes. Reessayez plus tard.",
      code: "RATE_LIMIT_EXCEEDED",
      details: {
        windowMs,
        max,
      },
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  },
});

module.exports = globalLimiter;
