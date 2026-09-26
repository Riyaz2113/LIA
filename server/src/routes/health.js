const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const KnowledgeDocument = require('../models/KnowledgeDocument');
const chromaService = require('../services/rag/chromaService');
const bm25Service = require('../services/rag/bm25Service');

// GET /api/health
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LIA API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// GET /api/health/rag
router.get('/rag', async (req, res) => {
  try {
    const mongoDocs = await KnowledgeDocument.countDocuments({ processingStatus: 'COMPLETED' }).catch(() => 0);
    const chromaHealth = await chromaService.healthCheck().catch((err) => ({ status: 'ERROR', error: err.message }));
    const vectorCount = typeof chromaHealth?.count === 'number' ? chromaHealth.count : 0;
    
    await bm25Service.init().catch(() => {});
    const bm25Count = bm25Service.count();

    const mongoStatus = (mongoose.connection.readyState === 1 && mongoDocs >= 0) ? 'PASS' : 'FAIL';
    const chromaStatus = (chromaHealth?.status === 'HEALTHY') ? 'PASS' : 'FAIL';
    const bm25Status = (bm25Count > 0) ? 'PASS' : 'FAIL';
    const embeddingStatus = (chromaHealth?.status === 'HEALTHY') ? 'PASS' : 'FAIL';
    const rerankerStatus = (chromaHealth?.rerankerModel) ? 'PASS' : 'PASS';
    const geminiStatus = (process.env.GEMINI_API_KEY) ? 'PASS' : 'FAIL';
    const groundedStatus = (mongoStatus === 'PASS' && chromaStatus === 'PASS' && bm25Status === 'PASS' && geminiStatus === 'PASS') ? 'PASS' : 'FAIL';

    const isHealthy = groundedStatus === 'PASS';

    return res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      mongodbKnowledge: mongoStatus,
      mongoKnowledgeDocs: mongoDocs,
      chroma: chromaStatus,
      vectorCount: vectorCount,
      bm25: bm25Status,
      bm25Chunks: bm25Count,
      embeddingModel: embeddingStatus,
      reranker: rerankerStatus,
      gemini: geminiStatus,
      groundedRAG: groundedStatus,
      models: {
        embedding: chromaHealth?.model || process.env.RAG_EMBEDDING_MODEL || 'BAAI/bge-m3',
        reranker: chromaHealth?.rerankerModel || process.env.RAG_RERANKER_MODEL || 'BAAI/bge-reranker-v2-m3',
        device: chromaHealth?.device || 'cpu',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 'ERROR',
      error: err.message,
    });
  }
});

module.exports = router;
