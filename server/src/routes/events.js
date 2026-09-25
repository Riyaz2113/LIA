const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// List and view events (Public / Authenticated)
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Admin-only mutations
router.post('/', requireAuth, authorizeRoles('ADMIN'), eventController.createEvent);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), eventController.updateEvent);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), eventController.deleteEvent);

module.exports = router;
