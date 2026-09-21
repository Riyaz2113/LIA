const { verifyToken, AUTH_COOKIE_NAME } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * requireAuth
 * Authentication middleware — must run before any protected route handler.
 *
 * Flow:
 *   1. Read JWT from the HTTP-only cookie (lia_token).
 *   2. Verify the JWT signature and expiry.
 *   3. Load the User document from MongoDB.
 *   4. Confirm the user account is active.
 *   5. Attach the user to req.user.
 *
 * On failure → HTTP 401 (never 403 — that is authorizeRoles' job).
 * Stack traces are not exposed in API responses.
 */
const requireAuth = async (req, res, next) => {
  try {
    // ── 1. Extract token from HTTP-only cookie ───────────────────────────────
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // ── 2. Verify JWT ────────────────────────────────────────────────────────
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      // Covers TokenExpiredError, JsonWebTokenError, etc.
      return next(new AppError('Session expired or invalid. Please log in again.', 401));
    }

    // ── 3. Load user — password is excluded by `select: false` ──────────────
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new AppError('User account no longer exists.', 401));
    }

    // ── 4. Confirm account is active ─────────────────────────────────────────
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact administration.', 401));
    }

    // ── 5. Attach to request ─────────────────────────────────────────────────
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireAuth;
