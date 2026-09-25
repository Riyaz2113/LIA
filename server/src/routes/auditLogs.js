const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Admin-only audit logs access
router.get('/', requireAuth, authorizeRoles('ADMIN'), auditLogController.getAllAuditLogs);

module.exports = router;
