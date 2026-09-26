/**
 * retrievalService.js
 * Advanced Multi-Stage Retrieval Pipeline for LIA RAG:
 * 1. retrieveKnowledge: Dense-only vector retrieval (BGE-M3 + ChromaDB)
 * 2. retrieveHybrid: Hybrid retrieval (BGE-M3 + BM25 + RRF) with Institutional Query Expansion
 * 3. retrieveReranked: Full Multi-Stage Retrieval (Hybrid Pool -> BAAI/bge-reranker-v2-m3 Cross-Encoder)
 */

const { generateQueryEmbedding } = require('./embeddingService');
const chromaService = require('./chromaService');
const bm25Service = require('./bm25Service');
const { reciprocalRankFusion } = require('./rrf');
const { rerankCandidates } = require('./rerankerService');

/**
 * expandInstitutionalQuery
 * Expands abbreviations and common educational query variations for high-recall sparse & dense retrieval.
 * Does NOT replace the user's original query for LLM generation or Cross-Encoder scoring.
 *
 * @param {string} query
 * @returns {string} Expanded search query string
 */
const expandInstitutionalQuery = (query = '') => {
  if (!query || typeof query !== 'string') return '';
  let expanded = query.trim();

  // Branch & Department abbreviations
  if (/\baiml\b/i.test(expanded) || /\bai\s*ml\b/i.test(expanded) || /\bai&ml\b/i.test(expanded)) {
    expanded += ' Artificial Intelligence & Machine Learning AIML';
  }
  if (/\bcsd\b/i.test(expanded)) {
    expanded += ' Computer Science and Data Science CSD';
  }
  if (/\bcsm\b/i.test(expanded)) {
    expanded += ' Computer Science and Machine Learning CSM';
  }
  if (/\bcai\b/i.test(expanded)) {
    expanded += ' Computer Science and Artificial Intelligence CAI';
  }

  // Academic Year / Semester variations
  if (/\b(4th\s*year|4\s*year|fourth\s*year|4th\s*yr|iv\s*year|iv-i|iv\s*1)\b/i.test(expanded)) {
    expanded += ' IV B.Tech IV-I IV Year 4th Year';
  }
  if (/\b(3rd\s*year|3\s*year|third\s*year|3rd\s*yr|iii\s*year|iii-i|iii\s*1)\b/i.test(expanded)) {
    expanded += ' III B.Tech III-I III Year 3rd Year';
  }
  if (/\b(2nd\s*year|2\s*year|second\s*year|2nd\s*yr|ii\s*year|ii-i|ii\s*1)\b/i.test(expanded)) {
    expanded += ' II B.Tech II-I II Year 2nd Year';
  }
  if (/\b(1st\s*year|1\s*year|first\s*year|1st\s*yr|i\s*year|i-i|i\s*1)\b/i.test(expanded)) {
    expanded += ' I B.Tech I-I I Year 1st Year';
  }

  // Timetable / Schedule variations
  if (/\b(time\s*table|timetable|schedule)\b/i.test(expanded)) {
    expanded += ' TIME TABLE timetable schedule';
  }

  return expanded;
};

/**
 * isTimetableQuery
 * Detects whether the search query relates to class timetables, daily schedules, or timings.
 */
const isTimetableQuery = (queryText = '') => {
  if (!queryText || typeof queryText !== 'string') return false;
  const normalized = queryText.toLowerCase();
  const timetablePatterns = [
    /\btimetable\b/i,
    /\btime\s*table\b/i,
    /\btime_table\b/i,
    /\bclass\s*schedule\b/i,
    /\bweekly\s*schedule\b/i,
    /\btoday'?s\s*classes\b/i,
    /\btomorrow'?s\s*classes\b/i,
    /\blecture\s*schedule\b/i,
    /\bclass\s*timings?\b/i,
    /\bperiods?\s*schedule\b/i,
    /\bperiod\s*timings?\b/i,
    /\bclass\s*routine\b/i,
    /\b(4th|3rd|2nd|1st|iv|iii|ii|i)\s*(year|b\.?tech)?\s*(timetable|time\s*table|schedule)\b/i,
    /\b(aiml|cse|ece|it|csd|csm|cai)\s*(timetable|time\s*table|schedule)\b/i,
  ];
  return timetablePatterns.some((pattern) => pattern.test(normalized));
};

/**
 * isTimetableChunk
 * Checks if a candidate chunk belongs to a timetable or schedule document.
 */
const isTimetableChunk = (chunk) => {
  if (!chunk) return false;
  const title = (chunk.metadata?.title || '').toLowerCase();
  const source = (chunk.metadata?.source || '').toLowerCase();
  const section = (chunk.metadata?.section || '').toLowerCase();
  const text = (chunk.text || '').toLowerCase();

  return (
    title.includes('timetable') ||
    title.includes('time table') ||
    title.includes('time_table') ||
    title.includes('schedule') ||
    source.includes('timetable') ||
    source.includes('time table') ||
    source.includes('time_table') ||
    source.includes('schedule') ||
    section.includes('timetable') ||
    section.includes('schedule') ||
    text.includes('time table') ||
    text.includes('timetable')
  );
};

/**
 * retrieveKnowledge
 * Dense-only vector retrieval (BGE-M3 + ChromaDB).
 *
 * @param {string} query - Natural language search query
 * @param {Object} [options]
 * @param {number} [options.topK=5] - Number of candidate chunks to retrieve
 * @returns {Promise<Array<Object>>} Ranked list of matching chunks with similarity scores
 */
const retrieveKnowledge = async (query, options = {}) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return [];
  }

  const topK = Number(options.topK || 5);

  // 1. Generate Query Vector Embedding with BGE-M3
  const queryEmbedding = await generateQueryEmbedding(query.trim());

  // 2. Query ChromaDB Collection
  const matches = await chromaService.querySimilarity(queryEmbedding, topK);

  // 3. Format structured results
  return matches.map((match) => ({
    documentId: match.documentId || match.metadata?.documentId,
    chunkIndex: match.chunkIndex !== undefined ? match.chunkIndex : match.metadata?.chunkIndex,
    text: match.text,
    score: match.score,
    metadata: {
      source: match.metadata?.source || '',
      title: match.metadata?.title || '',
      pageNumber: match.metadata?.pageNumber !== -1 ? match.metadata?.pageNumber : null,
      section: match.metadata?.section || null,
      contentHash: match.metadata?.contentHash || '',
    },
  }));
};

/**
 * retrieveHybrid
 * Hybrid retrieval combining dense vector similarity and sparse BM25 keyword matching via RRF.
 *
 * @param {string} query - User search query
 * @param {Object} [options]
 * @param {number} [options.vectorTopK=10] - Number of vector candidates
 * @param {number} [options.bm25TopK=10] - Number of BM25 candidates
 * @param {number} [options.finalTopK=10] - Number of fused top results to return
 * @param {number} [options.rrfK=60] - RRF smoothing parameter
 * @returns {Promise<Array<Object>>} Fused and ranked list of chunks
 */
const retrieveHybrid = async (query, options = {}) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return [];
  }

  const isTimetable = isTimetableQuery(query);
  const expandedQuery = expandInstitutionalQuery(query);

  const vectorTopK = Number(options.vectorTopK || process.env.RAG_VECTOR_TOP_K || (isTimetable ? 15 : 10));
  const bm25TopK = Number(options.bm25TopK || process.env.RAG_BM25_TOP_K || (isTimetable ? 15 : 10));
  const finalTopK = Number(options.finalTopK || process.env.RAG_HYBRID_TOP_K || (isTimetable ? 15 : 10));
  const rrfK = Number(options.rrfK || process.env.RRF_K || 60);

  // 1. Concurrently run Dense Vector Search & BM25 Keyword Search (using expanded query for high recall)
  const [vectorResults, bm25Results] = await Promise.all([
    retrieveKnowledge(query, { topK: vectorTopK }),
    bm25Service.search(expandedQuery || query, bm25TopK),
  ]);

  // 2. Fuse candidate rankings using Reciprocal Rank Fusion
  const fusedResults = reciprocalRankFusion(vectorResults, bm25Results, {
    rrfK,
    finalTopK,
  });

  // 3. If timetable query, boost timetable candidate chunks in the candidate pool
  if (isTimetable) {
    fusedResults.forEach((cand) => {
      if (isTimetableChunk(cand)) {
        cand.rrfScore = (cand.rrfScore || 0) + 0.05;
      }
    });
    fusedResults.sort((a, b) => (b.rrfScore || 0) - (a.rrfScore || 0));
  }

  return fusedResults;
};

/**
 * retrieveReranked
 * Full multi-stage retrieval: Hybrid Retrieval (BGE-M3 + BM25 + RRF) followed by Cross-Encoder Reranking (BGE-Reranker-v2-m3).
 *
 * @param {string} query - Natural language user query
 * @param {Object} [options]
 * @param {number} [options.vectorTopK=10]
 * @param {number} [options.bm25TopK=10]
 * @param {number} [options.hybridTopK=10]
 * @param {number} [options.rerankTopK=5]
 * @param {number} [options.rrfK=60]
 * @returns {Promise<{ query: string, candidates: Array<Object> }>} Reranked candidates with scores and metadata
 */
const retrieveReranked = async (query, options = {}) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return { query: query || '', candidates: [] };
  }

  const isTimetable = isTimetableQuery(query);
  const vectorTopK = Number(options.vectorTopK || process.env.RAG_VECTOR_TOP_K || (isTimetable ? 15 : 10));
  const bm25TopK = Number(options.bm25TopK || process.env.RAG_BM25_TOP_K || (isTimetable ? 15 : 10));
  const hybridTopK = Number(options.hybridTopK || process.env.RAG_HYBRID_TOP_K || (isTimetable ? 15 : 10));
  const rerankTopK = Number(options.rerankTopK || process.env.RAG_RERANK_TOP_K || 5);
  const rrfK = Number(options.rrfK || process.env.RRF_K || 60);

  // Stage 1 & 2: Generate Hybrid Candidate Pool via Dense Vector + BM25 + RRF
  const hybridCandidates = await retrieveHybrid(query, {
    vectorTopK,
    bm25TopK,
    finalTopK: hybridTopK,
    rrfK,
  });

  // Stage 3: High-precision Cross-Encoder scoring over candidate pool
  const reranked = await rerankCandidates(query, hybridCandidates, {
    topK: rerankTopK,
  });

  // Stage 4: If timetable query, apply priority boosting to verified timetable chunks
  if (isTimetable && Array.isArray(reranked)) {
    reranked.forEach((cand) => {
      if (isTimetableChunk(cand) && typeof cand.rerankerScore === 'number') {
        cand.rerankerScore += 1.5;
      }
    });
    reranked.sort((a, b) => (b.rerankerScore || 0) - (a.rerankerScore || 0));
  }

  return {
    query: query.trim(),
    candidates: reranked,
  };
};

module.exports = {
  retrieveKnowledge,
  retrieveHybrid,
  retrieveReranked,
  isTimetableQuery,
  isTimetableChunk,
  expandInstitutionalQuery,
};
