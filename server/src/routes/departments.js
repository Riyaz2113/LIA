const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Public or Authenticated listing of departments
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);

// Admin-only management
router.post('/', requireAuth, authorizeRoles('ADMIN'), departmentController.createDepartment);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), departmentController.updateDepartment);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), departmentController.deleteDepartment);

module.exports = router;
