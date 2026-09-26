const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * ChatMessage
 * Individual message within a ChatConversation.
 *
 * The `sources` field is designed to hold RAG citation data in a future phase.
 * Each source object will contain:
 *   - documentId: reference to KnowledgeDocument
 *   - chunkIndex: which chunk within the document was retrieved
 *   - score: relevance score
 *   - excerpt: short text preview
 *
 * AI/LLM/RAG logic is NOT implemented here — this is only the DB schema.
 */
const chatMessageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'ChatConversation',
      required: [true, 'Conversation is required'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // null when senderType is ASSISTANT or SYSTEM
      default: null,
    },
    senderType: {
      type: String,
      enum: {
        values: ['USER', 'ASSISTANT', 'SYSTEM'],
        message: 'Sender type must be USER, ASSISTANT, or SYSTEM',
      },
      required: [true, 'Sender type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    messageType: {
      type: String,
      enum: {
        values: ['TEXT', 'FILE', 'SYSTEM'],
        message: 'Message type must be TEXT, FILE, or SYSTEM',
      },
      default: 'TEXT',
    },
    sources: [
      {
        // RAG citation structure — populated in the future AI phase
        documentId: {
          type: Schema.Types.ObjectId,
          ref: 'KnowledgeDocument',
          default: null,
        },
        chunkIndex: {
          type: Number,
          default: null,
        },
        score: {
          type: Number,
          default: null,
        },
        excerpt: {
          type: String,
          trim: true,
          default: '',
        },
        metadata: {
          type: Schema.Types.Mixed,
          default: {},
        },
      },
    ],
  },
  {
    timestamps: true,
    // createdAt is the canonical message timestamp
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
chatMessageSchema.index({ conversation: 1, createdAt: 1 }); // Fetch messages in order
chatMessageSchema.index({ conversation: 1, senderType: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
