const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Student attendance view
router.get('/student', requireAuth, authorizeRoles('STUDENT'), attendanceController.getStudentAttendance);

// Attendance overview for Admin & Faculty
router.get('/overview', requireAuth, authorizeRoles('ADMIN', 'FACULTY'), attendanceController.getAttendanceOverview);
router.get('/', requireAuth, attendanceController.getAttendanceOverview);

// Faculty / Admin batch attendance entry
router.post('/batch', requireAuth, authorizeRoles('FACULTY', 'ADMIN'), attendanceController.markBatchAttendance);

module.exports = router;
