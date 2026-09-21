const AppError = require('../utils/AppError');

/**
 * authorizeRoles
 * Role-Based Access Control middleware factory.
 * Must be used AFTER requireAuth — it depends on req.user being populated.
 *
 * Usage:
 *   router.get('/admin-only', requireAuth, authorizeRoles('ADMIN'), handler);
 *   router.get('/staff',      requireAuth, authorizeRoles('FACULTY', 'ADMIN'), handler);
 *   router.get('/student',    requireAuth, authorizeRoles('STUDENT'), handler);
 *
 * On insufficient role → HTTP 403 (authenticated but not authorized).
 *
 * @param {...string} roles - Allowed roles: 'STUDENT' | 'FACULTY' | 'ADMIN'
 * @returns Express middleware
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Should not happen if requireAuth is used first, but defensive check
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. This resource requires one of the following roles: ${roles.join(', ')}.`,
          403
        )
      );
    }

    next();
  };
};

module.exports = authorizeRoles;
