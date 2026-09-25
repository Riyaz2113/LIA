/**
 * ragService.js
 * Master RAG Orchestration Layer for LIA Assistant.
 * Coordinates: Query -> Hybrid Search -> RRF -> Cross-Encoder -> Grounded Prompt -> Gemini -> Sources + Answer.
 */

const mongoose = require('mongoose');
const { retrieveReranked } = require('./retrievalService');
const { buildGroundedContext, buildGroundedPrompt } = require('./groundingPrompt');
const { generateAIResponse } = require('../ai/provider');

/**
 * generateGroundedResponse
 * End-to-end RAG response generation grounded in institutional knowledge.
 *
 * @param {Object} params
 * @param {string} params.query - User natural language query
 * @param {Object} [params.user] - Authenticated user context (name, role)
 * @param {Array<Object>} [params.conversationHistory=[]] - Previous message turns
 * @param {Object} [params.options={}] - Retrieval & reranking configuration
 * @returns {Promise<{ text: string, sources: Array<Object>, provider: string, model: string }>}
 */
const generateGroundedResponse = async ({
  query,
  user = null,
  conversationHistory = [],
  options = {},
}) => {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return {
      text: 'Please enter a valid message or question.',
      sources: [],
      provider: 'lia-system',
      model: 'validation',
    };
  }

  const cleanQuery = query.trim();
  const maxContextChars = Number(process.env.RAG_MAX_CONTEXT_CHARS || 20000);
  const minRerankScore = Number(process.env.RAG_MIN_RERANK_SCORE || -8.0);

  // 1. Execute Multi-Stage Retrieval (Vector + BM25 -> RRF -> Cross-Encoder)
  let retrievedCandidates = [];
  try {
    const retrievalOutput = await retrieveReranked(cleanQuery, {
      vectorTopK: options.vectorTopK || Number(process.env.RAG_VECTOR_TOP_K || 10),
      bm25TopK: options.bm25TopK || Number(process.env.RAG_BM25_TOP_K || 10),
      hybridTopK: options.hybridTopK || Number(process.env.RAG_HYBRID_TOP_K || 10),
      rerankTopK: options.rerankTopK || Number(process.env.RAG_RERANK_TOP_K || 5),
    });
    retrievedCandidates = retrievalOutput.candidates || [];
  } catch (err) {
    console.warn('RAG retrieval pipeline error:', err.message);
    retrievedCandidates = [];
  }

  // 2. Filter candidates by relevance score threshold
  const verifiedCandidates = retrievedCandidates.filter(
    (c) => typeof c.rerankerScore === 'number' && c.rerankerScore >= minRerankScore
  );

  // 3. Build Grounded Context and Prompt
  const contextString = buildGroundedContext(verifiedCandidates, maxContextChars);
  const groundedPrompt = buildGroundedPrompt(contextString);

  // 4. Assemble Multi-Turn Message History for Gemini
  const recentHistory = conversationHistory.slice(-8).map((m) => ({
    senderType: m.senderType || (m.role === 'user' ? 'USER' : 'ASSISTANT'),
    message: m.message || m.content || '',
  }));

  const messagesForLLM = [...recentHistory, { senderType: 'USER', message: cleanQuery }];

  // 5. Generate Grounded AI Response via Gemini Provider
  const aiResponse = await generateAIResponse({
    messages: messagesForLLM,
    systemPrompt: groundedPrompt,
    user,
  });

  // 6. Format Structured Sources for downstream citation & storage
  const sources = verifiedCandidates.map((c) => {
    let validDocId = null;
    if (c.documentId && mongoose.Types.ObjectId.isValid(String(c.documentId))) {
      validDocId = String(c.documentId);
    }

    return {
      documentId: validDocId,
      chunkIndex: c.chunkIndex !== undefined ? c.chunkIndex : 0,
      score: typeof c.rerankerScore === 'number' ? c.rerankerScore : c.vectorScore,
      excerpt: (c.text || '').slice(0, 300),
      metadata: {
        source: c.metadata?.source || '',
        title: c.metadata?.title || '',
        pageNumber: c.metadata?.pageNumber !== -1 && c.metadata?.pageNumber !== undefined ? c.metadata?.pageNumber : null,
        section: c.metadata?.section || null,
        contentHash: c.metadata?.contentHash || '',
      },
    };
  });

  return {
    text: aiResponse.text,
    sources,
    provider: aiResponse.provider,
    model: aiResponse.model,
  };
};

module.exports = {
  generateGroundedResponse,
};
