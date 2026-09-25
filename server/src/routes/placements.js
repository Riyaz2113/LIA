const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Placement Drives
router.get('/drives', placementController.getAllDrives);
router.get('/drives/:id', placementController.getDriveById);
router.post('/drives', requireAuth, authorizeRoles('ADMIN'), placementController.createDrive);
router.put('/drives/:id', requireAuth, authorizeRoles('ADMIN'), placementController.updateDrive);
router.delete('/drives/:id', requireAuth, authorizeRoles('ADMIN'), placementController.deleteDrive);

// Companies list & creation
router.get('/companies', placementController.getAllCompanies);
router.post('/companies', requireAuth, authorizeRoles('ADMIN'), placementController.createCompany);

// Root fallback maps to /drives
router.get('/', placementController.getAllDrives);

module.exports = router;
