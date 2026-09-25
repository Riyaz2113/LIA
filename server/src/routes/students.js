const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Student own-profile endpoints
router.get('/me', requireAuth, authorizeRoles('STUDENT'), studentController.getMe);
router.put('/me', requireAuth, authorizeRoles('STUDENT'), studentController.updateMe);

// List all students - Admin and Faculty allowed
router.get('/', requireAuth, authorizeRoles('ADMIN', 'FACULTY'), studentController.getAllStudents);

// Get single student by ID
router.get('/:id', requireAuth, studentController.getStudentById);

// Admin-only mutations
router.post('/', requireAuth, authorizeRoles('ADMIN'), studentController.createStudent);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), studentController.updateStudent);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), studentController.deleteStudent);

module.exports = router;
