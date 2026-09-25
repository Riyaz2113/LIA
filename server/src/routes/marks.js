const express = require('express');
const router = express.Router();
const markController = require('../controllers/markController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Student results
router.get('/student', requireAuth, authorizeRoles('STUDENT'), markController.getStudentMarks);

// Results list for Admin and Faculty
router.get('/', requireAuth, markController.getAllMarks);

// Enter / update marks - Faculty and Admin
router.post('/', requireAuth, authorizeRoles('FACULTY', 'ADMIN'), markController.enterMarks);

module.exports = router;
