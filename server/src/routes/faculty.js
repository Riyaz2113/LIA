const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Faculty own profile endpoints
router.get('/me', requireAuth, authorizeRoles('FACULTY'), facultyController.getMe);
router.put('/me', requireAuth, authorizeRoles('FACULTY'), facultyController.updateMe);

// List faculty
router.get('/', requireAuth, facultyController.getAllFaculty);

// Get single faculty
router.get('/:id', requireAuth, facultyController.getFacultyById);

// Admin-only creation
router.post('/', requireAuth, authorizeRoles('ADMIN'), facultyController.createFaculty);

// Update faculty (Faculty own profile or Admin)
router.put('/:id', requireAuth, authorizeRoles('ADMIN', 'FACULTY'), facultyController.updateFaculty);

// Admin delete
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), facultyController.deleteFaculty);

module.exports = router;
