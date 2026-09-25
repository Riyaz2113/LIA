const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Admin Dashboard stats
router.get('/admin', requireAuth, authorizeRoles('ADMIN'), dashboardController.getAdminDashboard);

// Student Dashboard stats
router.get('/student', requireAuth, authorizeRoles('STUDENT'), dashboardController.getStudentDashboard);

// Faculty Dashboard stats
router.get('/faculty', requireAuth, authorizeRoles('FACULTY'), dashboardController.getFacultyDashboard);

// Default fallback
router.get('/', requireAuth, (req, res, next) => {
  if (req.user.role === 'ADMIN') return dashboardController.getAdminDashboard(req, res, next);
  if (req.user.role === 'FACULTY') return dashboardController.getFacultyDashboard(req, res, next);
  return dashboardController.getStudentDashboard(req, res, next);
});

module.exports = router;
