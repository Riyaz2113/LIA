const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Public / Authenticated media gallery
router.get('/', mediaController.getAllMedia);

// Admin-only management
router.post('/', requireAuth, authorizeRoles('ADMIN'), mediaController.createMedia);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), mediaController.updateMedia);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), mediaController.deleteMedia);

module.exports = router;
