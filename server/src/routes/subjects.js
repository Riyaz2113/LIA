const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// List and get subjects
router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);

// Admin-only mutations
router.post('/', requireAuth, authorizeRoles('ADMIN'), subjectController.createSubject);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), subjectController.updateSubject);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), subjectController.deleteSubject);

module.exports = router;
