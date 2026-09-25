/**
 * rrf.js
 * Reciprocal Rank Fusion (RRF) implementation for LIA Hybrid Retrieval.
 * Combines dense vector retrieval rankings and sparse BM25 lexical rankings.
 */

const computeCandidateKey = (candidate) => {
  const docId = String(candidate.documentId || '');
  const chunkIdx = String(candidate.chunkIndex !== undefined ? candidate.chunkIndex : '');
  const hash = String(candidate.metadata?.contentHash || candidate.contentHash || '');
  return `${docId}_${chunkIdx}_${hash}`;
};

/**
 * reciprocalRankFusion
 * Merges ranked result lists from Vector (Dense) and BM25 (Sparse) retrieval.
 *
 * @param {Array<Object>} vectorResults - Ranked candidate list from ChromaDB
 * @param {Array<Object>} bm25Results - Ranked candidate list from BM25
 * @param {Object} [options]
 * @param {number} [options.rrfK=60] - RRF smoothing parameter (default 60)
 * @param {number} [options.finalTopK=5] - Number of fused top candidates to return
 * @returns {Array<Object>} Fused and re-ranked candidate list
 */
const reciprocalRankFusion = (vectorResults = [], bm25Results = [], options = {}) => {
  const rrfK = Number(options.rrfK || process.env.RRF_K || 60);
  const finalTopK = Number(options.finalTopK || process.env.RAG_FINAL_TOP_K || 5);

  const candidateMap = new Map();

  // 1. Process Vector Rankings (Dense)
  for (let rank = 0; rank < vectorResults.length; rank++) {
    const item = vectorResults[rank];
    const key = computeCandidateKey(item);
    const rankNum = rank + 1; // 1-indexed rank
    const scoreContribution = 1 / (rrfK + rankNum);

    if (!candidateMap.has(key)) {
      candidateMap.set(key, {
        documentId: item.documentId,
        chunkIndex: item.chunkIndex,
        text: item.text,
        vectorScore: typeof item.score === 'number' ? item.score : null,
        bm25Score: null,
        rrfScore: scoreContribution,
        metadata: item.metadata || {},
        vectorRank: rankNum,
        bm25Rank: null,
      });
    } else {
      const existing = candidateMap.get(key);
      existing.vectorScore = typeof item.score === 'number' ? item.score : null;
      existing.rrfScore += scoreContribution;
      existing.vectorRank = rankNum;
    }
  }

  // 2. Process BM25 Rankings (Sparse)
  for (let rank = 0; rank < bm25Results.length; rank++) {
    const item = bm25Results[rank];
    const key = computeCandidateKey(item);
    const rankNum = rank + 1; // 1-indexed rank
    const scoreContribution = 1 / (rrfK + rankNum);

    if (!candidateMap.has(key)) {
      candidateMap.set(key, {
        documentId: item.documentId,
        chunkIndex: item.chunkIndex,
        text: item.text,
        vectorScore: null,
        bm25Score: typeof item.score === 'number' ? item.score : null,
        rrfScore: scoreContribution,
        metadata: item.metadata || {},
        vectorRank: null,
        bm25Rank: rankNum,
      });
    } else {
      const existing = candidateMap.get(key);
      existing.bm25Score = typeof item.score === 'number' ? item.score : null;
      existing.rrfScore += scoreContribution;
      existing.bm25Rank = rankNum;
    }
  }

  // 3. Sort candidates descending by fused RRF score
  const fusedList = Array.from(candidateMap.values());
  fusedList.sort((a, b) => b.rrfScore - a.rrfScore);

  // 4. Return top-k candidates with clean structured format
  return fusedList.slice(0, finalTopK).map((c) => ({
    documentId: c.documentId,
    chunkIndex: c.chunkIndex,
    text: c.text,
    vectorScore: c.vectorScore,
    bm25Score: c.bm25Score,
    rrfScore: c.rrfScore,
    metadata: c.metadata,
  }));
};

module.exports = {
  reciprocalRankFusion,
};
