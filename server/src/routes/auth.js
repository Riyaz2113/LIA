const express = require('express');
const { body } = require('express-validator');
const { login, logout, getCurrentUser } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

// ─── Login Validation ─────────────────────────────────────────────────────────
const loginValidation = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or roll number is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Identifier must be between 3 and 100 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// ─── Public Routes ────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', loginValidation, login);

// POST /api/auth/logout
router.post('/logout', logout);

// ─── Protected Routes ─────────────────────────────────────────────────────────
// GET /api/auth/me — any authenticated user
router.get('/me', requireAuth, getCurrentUser);

// ─── Role Test Routes (development / verification) ────────────────────────────
// These demonstrate that authentication + RBAC are working correctly.
// They can be removed in a later phase if no longer needed.

// GET /api/auth/test/student — STUDENT only
router.get(
  '/test/student',
  requireAuth,
  authorizeRoles('STUDENT'),
  (req, res) =>
    res.json({ success: true, message: 'Student access confirmed.', role: req.user.role })
);

// GET /api/auth/test/faculty — FACULTY only
router.get(
  '/test/faculty',
  requireAuth,
  authorizeRoles('FACULTY'),
  (req, res) =>
    res.json({ success: true, message: 'Faculty access confirmed.', role: req.user.role })
);

// GET /api/auth/test/admin — ADMIN only
router.get(
  '/test/admin',
  requireAuth,
  authorizeRoles('ADMIN'),
  (req, res) =>
    res.json({ success: true, message: 'Admin access confirmed.', role: req.user.role })
);

// GET /api/auth/test/staff — FACULTY or ADMIN
router.get(
  '/test/staff',
  requireAuth,
  authorizeRoles('FACULTY', 'ADMIN'),
  (req, res) =>
    res.json({ success: true, message: 'Staff access confirmed.', role: req.user.role })
);

module.exports = router;
