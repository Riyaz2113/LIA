const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * KnowledgeDocument
 * Database foundation for the future LIA RAG (Retrieval-Augmented Generation) system.
 *
 * This model stores ONLY metadata about uploaded knowledge documents.
 * It does NOT implement:
 *   - Text chunking
 *   - Embedding generation
 *   - Vector storage (FAISS/Pinecone/etc.)
 *   - BM25 indexing
 *   - Reranking
 *   - Gemini/OpenAI API calls
 *
 * The processingStatus field will be updated by the RAG pipeline in a future phase.
 * The vectorIndex field will reference the external vector store index in a future phase.
 */
const knowledgeDocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
      // Cloudinary or other storage URL — never store binary in DB
    },
    fileType: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'File type cannot exceed 20 characters'],
      // e.g. "PDF", "DOCX", "TXT"
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ['ACADEMIC', 'EXAM', 'PLACEMENT', 'HOSTEL', 'REGULATIONS', 'CAMPUS', 'GENERAL'],
        message: 'Category must be ACADEMIC, EXAM, PLACEMENT, HOSTEL, REGULATIONS, CAMPUS, or GENERAL',
      },
      required: [true, 'Category is required'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
    },
    processingStatus: {
      type: String,
      enum: {
        values: ['UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED'],
        message: 'Processing status must be UPLOADED, PROCESSING, PROCESSED, or FAILED',
      },
      default: 'UPLOADED',
    },
    chunkCount: {
      type: Number,
      // Number of text chunks created during RAG processing — set in future phase
      min: [0, 'Chunk count cannot be negative'],
      default: null,
    },
    vectorIndex: {
      type: String,
      trim: true,
      // Reference to the external vector store index ID — set in future phase
      default: null,
    },
    version: {
      type: Number,
      // Incremented when document is re-uploaded/re-processed
      default: 1,
      min: [1, 'Version must be at least 1'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
      // Timestamp when RAG processing completed — set in future phase
      default: null,
    },
    errorMessage: {
      type: String,
      trim: true,
      // Stores RAG pipeline error details when processingStatus is FAILED
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
knowledgeDocumentSchema.index({ category: 1 });
knowledgeDocumentSchema.index({ processingStatus: 1 });
knowledgeDocumentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
