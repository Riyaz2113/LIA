/**
 * rerankerService.js
 * High-precision Cross-Encoder Reranking service for LIA RAG pipeline.
 * Utilizes BAAI/bge-reranker-v2-m3 over the hybrid candidate pool (dense + sparse RRF).
 */

const { sendToWorker } = require('./embeddingService');

/**
 * rerankCandidates
 * Evaluates joint query-candidate relevance with BAAI/bge-reranker-v2-m3.
 *
 * @param {string} query - User search query
 * @param {Array<Object>} candidates - Candidate chunks from Hybrid Retrieval (RRF)
 * @param {Object} [options]
 * @param {number} [options.topK=5] - Number of top reranked chunks to return
 * @returns {Promise<Array<Object>>} Reranked candidates with preserved scores & metadata
 */
const rerankCandidates = async (query, candidates = [], options = {}) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return [];
  }

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return [];
  }

  const topK = Number(options.topK || process.env.RAG_RERANK_TOP_K || 5);
  const candidateTexts = candidates.map((c) => (c && c.text ? String(c.text) : ''));

  // 1. Send query and candidate texts to persistent Cross-Encoder worker
  const scores = await sendToWorker({
    action: 'rerank',
    query: query.trim(),
    candidateTexts,
  });

  if (!Array.isArray(scores) || scores.length !== candidates.length) {
    throw new Error(
      `Cross-Encoder returned ${Array.isArray(scores) ? scores.length : 0} scores for ${candidates.length} candidates.`
    );
  }

  // 2. Attach rerankerScore and preserve all preceding scores (vectorScore, bm25Score, rrfScore)
  const scoredCandidates = candidates.map((cand, idx) => ({
    documentId: cand.documentId,
    chunkIndex: cand.chunkIndex,
    text: cand.text,
    rerankerScore: scores[idx],
    vectorScore: cand.vectorScore !== undefined ? cand.vectorScore : null,
    bm25Score: cand.bm25Score !== undefined ? cand.bm25Score : null,
    rrfScore: cand.rrfScore !== undefined ? cand.rrfScore : null,
    metadata: cand.metadata || {},
  }));

  // 3. Sort descending by Cross-Encoder relevance score
  scoredCandidates.sort((a, b) => b.rerankerScore - a.rerankerScore);

  // 4. Return top-k reranked candidates
  return scoredCandidates.slice(0, topK);
};

module.exports = {
  rerankCandidates,
};
