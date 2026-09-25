const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// List and view study materials
router.get('/', requireAuth, materialController.getAllMaterials);
router.get('/:id', requireAuth, materialController.getMaterialById);

// Upload / update / delete - Faculty and Admin
router.post('/', requireAuth, authorizeRoles('FACULTY', 'ADMIN'), materialController.createMaterial);
router.put('/:id', requireAuth, authorizeRoles('FACULTY', 'ADMIN'), materialController.updateMaterial);
router.delete('/:id', requireAuth, authorizeRoles('FACULTY', 'ADMIN'), materialController.deleteMaterial);

module.exports = router;
