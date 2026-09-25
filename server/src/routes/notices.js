const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// Public & Student/Faculty access (uses optional auth to see drafts if Admin)
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);

// Admin-only management
router.post('/', requireAuth, authorizeRoles('ADMIN'), noticeController.createNotice);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), noticeController.updateNotice);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), noticeController.deleteNotice);

module.exports = router;
