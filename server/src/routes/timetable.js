const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Student schedule
router.get('/student', requireAuth, authorizeRoles('STUDENT'), timetableController.getStudentSchedule);

// Faculty schedule
router.get('/faculty', requireAuth, authorizeRoles('FACULTY'), timetableController.getFacultySchedule);

// General timetable retrieval
router.get('/', requireAuth, timetableController.getAllTimetable);

// Admin-only timetable management
router.post('/', requireAuth, authorizeRoles('ADMIN'), timetableController.createTimetableSlot);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), timetableController.updateTimetableSlot);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), timetableController.deleteTimetableSlot);

module.exports = router;
