/**
 * Express error handler middleware for consistent error responses.
 */
function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}]`, err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler; 