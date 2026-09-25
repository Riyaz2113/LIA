/**
 * chatController.js
 * Handles authenticated multi-turn chat sessions, persistent conversation threads,
 * Grounded RAG AI message generation, source metadata tracking, and strict user privacy isolation.
 */

const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { generateGroundedResponse } = require('../services/rag/ragService');

// ─── POST /api/chat/conversations ─────────────────────────────────────────────
const createConversation = async (req, res, next) => {
  try {
    const { title, initialMessage } = req.body;

    // Create conversation for authenticated user
    const conversation = await ChatConversation.create({
      user: req.user._id,
      title: title || (initialMessage ? initialMessage.slice(0, 50) : 'New Conversation'),
      lastMessage: initialMessage || '',
      lastMessageAt: initialMessage ? new Date() : null,
    });

    const messages = [];

    // If initial message provided, persist user message and generate assistant response via RAG
    if (initialMessage && initialMessage.trim() !== '') {
      const userMsg = await ChatMessage.create({
        conversation: conversation._id,
        sender: req.user._id,
        senderType: 'USER',
        message: initialMessage.trim(),
      });
      messages.push(userMsg);

      const ragResponse = await generateGroundedResponse({
        query: initialMessage.trim(),
        user: { name: req.user.name, role: req.user.role },
        conversationHistory: [],
      });

      const assistantMsg = await ChatMessage.create({
        conversation: conversation._id,
        sender: null,
        senderType: 'ASSISTANT',
        message: ragResponse.text,
        sources: ragResponse.sources || [],
      });
      messages.push(assistantMsg);

      conversation.lastMessage = ragResponse.text.slice(0, 400);
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    return sendSuccess(res, { conversation, messages }, 201);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/chat/conversations ──────────────────────────────────────────────
const getConversations = async (req, res, next) => {
  try {
    const conversations = await ChatConversation.find({
      user: req.user._id,
      isActive: true,
    })
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .limit(50);

    return sendSuccess(res, conversations);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/chat/conversations/:id ──────────────────────────────────────────
const getConversationById = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation || !conversation.isActive) {
      return next(new AppError('Conversation not found.', 404));
    }

    // Strict User Isolation
    if (!conversation.user.equals(req.user._id)) {
      return next(new AppError('Unauthorized access to this conversation.', 403));
    }

    const messages = await ChatMessage.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(100);

    return sendSuccess(res, { conversation, messages });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/chat/conversations/:id/messages ────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return next(new AppError('Message content cannot be empty.', 400));
    }

    if (message.length > 4000) {
      return next(new AppError('Message exceeds maximum allowed length of 4000 characters.', 400));
    }

    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation || !conversation.isActive) {
      return next(new AppError('Conversation not found.', 404));
    }

    // Strict User Isolation
    if (!conversation.user.equals(req.user._id)) {
      return next(new AppError('Unauthorized access to this conversation.', 403));
    }

    // 1. Persist USER Message in MongoDB Atlas
    const userMessage = await ChatMessage.create({
      conversation: conversation._id,
      sender: req.user._id,
      senderType: 'USER',
      message: message.trim(),
    });

    // 2. Retrieve recent conversation history for Multi-Turn Context (last 10 messages)
    const recentMessages = await ChatMessage.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    // 3. Generate Grounded RAG Assistant Response via Gemini
    const ragResponse = await generateGroundedResponse({
      query: message.trim(),
      user: { name: req.user.name, role: req.user.role },
      conversationHistory: recentMessages,
    });

    // 4. Persist ASSISTANT Message in MongoDB Atlas with Sources
    const assistantMessage = await ChatMessage.create({
      conversation: conversation._id,
      sender: null,
      senderType: 'ASSISTANT',
      message: ragResponse.text,
      sources: ragResponse.sources || [],
    });

    // 5. Update Conversation metadata
    conversation.lastMessage = ragResponse.text.slice(0, 400);
    conversation.lastMessageAt = new Date();
    if (conversation.title === 'New Conversation') {
      conversation.title = message.trim().slice(0, 60);
    }
    await conversation.save();

    return sendSuccess(res, {
      userMessage,
      assistantMessage,
      conversation,
    }, 201);
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/chat/conversations/:id ───────────────────────────────────────
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findById(req.params.id);

    if (!conversation) {
      return next(new AppError('Conversation not found.', 404));
    }

    // Strict User Isolation
    if (!conversation.user.equals(req.user._id)) {
      return next(new AppError('Unauthorized to delete this conversation.', 403));
    }

    // Safely remove messages and conversation
    await ChatMessage.deleteMany({ conversation: conversation._id });
    await ChatConversation.findByIdAndDelete(conversation._id);

    return sendSuccess(res, { message: 'Conversation deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  deleteConversation,
};
