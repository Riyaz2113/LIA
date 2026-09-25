const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// List and view exams
router.get('/', requireAuth, examController.getAllExams);
router.get('/:id', requireAuth, examController.getExamById);

// Admin-only exam management
router.post('/', requireAuth, authorizeRoles('ADMIN'), examController.createExam);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), examController.updateExam);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), examController.deleteExam);

module.exports = router;
