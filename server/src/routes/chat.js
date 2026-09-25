/**
 * chat.js
 * Routes for LIA Chat conversations, multi-turn messages, and history.
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const requireAuth = require('../middleware/requireAuth');

// All chat endpoints require authenticated session
router.use(requireAuth);

// Conversation management
router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:id', chatController.getConversationById);
router.delete('/conversations/:id', chatController.deleteConversation);

// Multi-turn message dispatching
router.post('/conversations/:id/messages', chatController.sendMessage);

module.exports = router;
