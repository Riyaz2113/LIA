const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Get own notifications
router.get('/', requireAuth, notificationController.getMyNotifications);

// Admin view all
router.get('/all', requireAuth, authorizeRoles('ADMIN'), notificationController.getAllNotifications);

// Mark as read
router.put('/:id/read', requireAuth, notificationController.markAsRead);

// Admin broadcast
router.post('/broadcast', requireAuth, authorizeRoles('ADMIN'), notificationController.broadcastNotification);

module.exports = router;
