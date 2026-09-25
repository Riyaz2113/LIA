const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

// List books
router.get('/', libraryController.getAllBooks);
router.get('/:id', libraryController.getBookById);

// Admin-only mutations
router.post('/', requireAuth, authorizeRoles('ADMIN'), libraryController.createBook);
router.put('/:id', requireAuth, authorizeRoles('ADMIN'), libraryController.updateBook);
router.delete('/:id', requireAuth, authorizeRoles('ADMIN'), libraryController.deleteBook);

module.exports = router;
