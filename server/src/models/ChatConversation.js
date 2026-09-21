const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * ChatConversation
 * A single conversation thread between a User and the LIA AI Assistant.
 * AI/LLM logic is NOT implemented here — this is only the DB schema.
 */
const chatConversationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
      // Auto-generated from first message in future AI phase
      default: 'New Conversation',
    },
    lastMessage: {
      type: String,
      trim: true,
      maxlength: [500, 'Last message preview cannot exceed 500 characters'],
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
chatConversationSchema.index({ user: 1, lastMessageAt: -1 }); // List user's conversations, most recent first
chatConversationSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
