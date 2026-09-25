/**
 * chromaService.js
 * Service for ChromaDB vector database interactions (collection lifecycle, upsert, query, health).
 */

const { sendToWorker } = require('./embeddingService');

/**
 * chromaService
 * Manages vector index operations on ChromaDB collection `lia_knowledge`.
 */
const chromaService = {
  /**
   * healthCheck
   * Verifies ChromaDB connection status, collection readiness, and vector counts.
   */
  healthCheck: async () => {
    return sendToWorker({ action: 'health' });
  },

  /**
   * count
   * Returns current count of vectors in the collection.
   */
  count: async () => {
    const res = await sendToWorker({ action: 'count' });
    return res.count || 0;
  },

  /**
   * upsertChunks
   * Stores chunks and their corresponding embeddings into ChromaDB with deterministic IDs.
   *
   * @param {Array<Object>} chunks - List of chunk objects
   * @param {Array<Array<number>>} embeddings - List of BGE-M3 embedding vectors
   * @returns {Promise<{ status: string, count: number }>}
   */
  upsertChunks: async (chunks, embeddings) => {
    if (!chunks || chunks.length === 0) {
      return { status: 'EMPTY', count: 0 };
    }

    if (chunks.length !== embeddings.length) {
      throw new Error(`Chunks count (${chunks.length}) does not match embeddings count (${embeddings.length})`);
    }

    return sendToWorker({
      action: 'upsert',
      chunks,
      embeddings,
    });
  },

  /**
   * querySimilarity
   * Performs cosine similarity vector search over the collection.
   *
   * @param {Array<number>} queryEmbedding - 1024-d query vector
   * @param {number} [topK=5] - Number of top chunks to return
   * @returns {Promise<Array<Object>>} Matching chunks with score and metadata
   */
  querySimilarity: async (queryEmbedding, topK = 5) => {
    return sendToWorker({
      action: 'query',
      queryEmbedding,
      topK,
    });
  },

  /**
   * deleteByDocumentId
   * Removes all chunk vectors associated with a given documentId.
   *
   * @param {string} documentId
   */
  deleteByDocumentId: async (documentId) => {
    return sendToWorker({
      action: 'delete',
      documentId: String(documentId),
    });
  },
};

module.exports = chromaService;
