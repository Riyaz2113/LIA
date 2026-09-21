/**
 * AppError
 * Operational error with an HTTP status code.
 * Thrown from controllers/services and caught by the central error handler.
 *
 * Usage:
 *   throw new AppError('User not found', 404);
 *   throw new AppError('Access denied', 403);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes from unexpected programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
