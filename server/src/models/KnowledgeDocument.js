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
      trim: true,
      default: '',
    },
    source: {
      type: String,
      trim: true,
      default: '',
    },
    hash: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    fileType: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'File type cannot exceed 20 characters'],
      default: null,
    },
    extractionMethod: {
      type: String,
      trim: true,
      default: 'native',
    },
    isScanned: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: {
        values: ['ACADEMIC', 'EXAM', 'PLACEMENT', 'HOSTEL', 'REGULATIONS', 'CAMPUS', 'GENERAL'],
        message: 'Category must be ACADEMIC, EXAM, PLACEMENT, HOSTEL, REGULATIONS, CAMPUS, or GENERAL',
      },
      default: 'GENERAL',
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processingStatus: {
      type: String,
      enum: {
        values: ['UPLOADED', 'PENDING', 'PROCESSING', 'PROCESSED', 'COMPLETED', 'FAILED', 'SKIPPED'],
        message: 'Invalid processing status',
      },
      default: 'PENDING',
    },
    chunkCount: {
      type: Number,
      min: [0, 'Chunk count cannot be negative'],
      default: 0,
    },
    embeddingModel: {
      type: String,
      trim: true,
      default: 'BAAI/bge-m3',
    },
    collectionName: {
      type: String,
      trim: true,
      default: 'lia_knowledge',
    },
    vectorIndex: {
      type: String,
      trim: true,
      default: null,
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'Version must be at least 1'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
knowledgeDocumentSchema.index({ category: 1 });
knowledgeDocumentSchema.index({ processingStatus: 1 });

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
