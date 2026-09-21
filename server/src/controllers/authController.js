const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const { generateToken, AUTH_COOKIE_NAME, getCookieOptions } = require('../utils/jwt');
const AppError = require('../utils/AppError');

/**
 * formatUserResponse
 * Returns a safe user object — password is never included.
 * The User schema also strips password via toJSON transform as a secondary defence.
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Login
 * Accepts email OR student roll number + password.
 *
 * Roll number flow:
 *   1. Find Student by rollNumber.
 *   2. Populate its linked User.
 *   3. Authenticate against User.password.
 *
 * Email flow:
 *   1. Find User by email (with password selected).
 *   2. Compare passwords.
 *
 * Generic error message is used for all credential failures to
 * avoid leaking whether an identifier exists (account enumeration).
 */
const login = async (req, res, next) => {
  try {
    // ── Validation errors from express-validator ─────────────────────────────
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { identifier, password } = req.body;

    // ── Resolve user from identifier ─────────────────────────────────────────
    let user = null;
    const GENERIC_ERROR = 'Invalid credentials. Please check your login details.';

    // Determine if identifier looks like an email
    const isEmail = /^\S+@\S+\.\S+$/.test(identifier);

    if (isEmail) {
      // Email login — works for STUDENT, FACULTY, ADMIN
      user = await User.findOne({ email: identifier.toLowerCase() }).select('+password');
    } else {
      // Roll number login — STUDENT only
      // Find the Student record by rollNumber, then resolve the linked User
      const student = await Student.findOne({
        rollNumber: identifier.toUpperCase(),
      }).populate({ path: 'user', select: '+password' });

      if (student) {
        user = student.user;
      }
    }

    // ── Validate credentials (generic error prevents enumeration) ─────────────
    if (!user) {
      return next(new AppError(GENERIC_ERROR, 401));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError(GENERIC_ERROR, 401));
    }

    // Verify account is active
    if (!user.isActive) {
      return next(
        new AppError('Your account has been deactivated. Please contact the administration.', 401)
      );
    }

    // ── Generate JWT and set HTTP-only cookie ─────────────────────────────────
    const token = generateToken(user._id.toString(), user.role);
    res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());

    // ── Update lastLogin ──────────────────────────────────────────────────────
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // ── Respond — never include password ────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: formatUserResponse(user),
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Logout
 * Clears the authentication cookie with matching settings.
 */
const logout = (req, res) => {
  res.cookie(AUTH_COOKIE_NAME, '', {
    ...getCookieOptions(),
    maxAge: 0, // Immediately expire the cookie
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────────────────────
/**
 * getCurrentUser
 * Returns the authenticated user's information and their associated profile.
 * Requires requireAuth middleware to have already run.
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is already populated by requireAuth — reload to ensure freshness
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found.', 401));
    }

    // ── Load role-specific profile ────────────────────────────────────────────
    let profile = null;

    if (user.role === 'STUDENT') {
      profile = await Student.findOne({ user: user._id })
        .populate('department', 'name code')
        .lean();
    } else if (user.role === 'FACULTY') {
      profile = await Faculty.findOne({ user: user._id })
        .populate('department', 'name code')
        .lean();
    }
    // ADMIN role — no separate profile document

    return res.status(200).json({
      success: true,
      user: formatUserResponse(user),
      profile,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, getCurrentUser };
