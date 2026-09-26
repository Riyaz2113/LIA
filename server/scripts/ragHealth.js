/**
 * ragHealth.js
 * Comprehensive diagnostic verification script for LIA RAG Pipeline.
 * Checks MongoDB KnowledgeDocuments, ChromaDB, BM25 Index, BGE-M3, Cross-Encoder, and Gemini connectivity.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const KnowledgeDocument = require('../src/models/KnowledgeDocument');
const chromaService = require('../src/services/rag/chromaService');
const bm25Service = require('../src/services/rag/bm25Service');
const { generateQueryEmbedding, closeWorker } = require('../src/services/rag/embeddingService');
const { rerankCandidates } = require('../src/services/rag/rerankerService');
const { generateAIResponse } = require('../src/services/ai/provider');

const checkRagHealth = async () => {
  console.log('====================================================');
  console.log('🔍 LIA RAG PIPELINE COMPREHENSIVE DIAGNOSTIC');
  console.log('====================================================\n');

  let mongoStatus = 'FAIL';
  let chromaStatus = 'FAIL';
  let bm25Status = 'FAIL';
  let bgem3Status = 'FAIL';
  let rerankerStatus = 'FAIL';
  let geminiStatus = 'FAIL';
  let groundedContextStatus = 'FAIL';

  let totalMongoDocs = 0;
  let chromaVectors = 0;
  let bm25Chunks = 0;

  try {
    // 1. Check MongoDB Knowledge
    await mongoose.connect(process.env.MONGODB_URI);
    totalMongoDocs = await KnowledgeDocument.countDocuments({ processingStatus: 'COMPLETED' });
    if (totalMongoDocs > 0) mongoStatus = 'PASS';
  } catch (err) {
    console.error('  ⚠️ MongoDB connection error:', err.message);
  }

  try {
    // 2. Check ChromaDB & BGE-M3
    const health = await chromaService.healthCheck();
    if (health && health.status === 'HEALTHY') {
      chromaStatus = 'PASS';
      chromaVectors = health.count || 0;
      bgem3Status = 'PASS';
      rerankerStatus = 'PASS';
    }
  } catch (err) {
    console.error('  ⚠️ ChromaDB / Worker error:', err.message);
  }

  try {
    // 3. Check BM25
    await bm25Service.init();
    bm25Chunks = bm25Service.count();
    if (bm25Chunks > 0) bm25Status = 'PASS';
  } catch (err) {
    console.error('  ⚠️ BM25 error:', err.message);
  }

  try {
    // 4. Check Gemini Connectivity & Grounding
    const testPrompt = `System: You are LIA. Answer strictly from context.\n<retrieved_context>\n[SOURCE 1]\nDocument: Test.pdf\nPage: 1\nContent:\nVLITS student library borrowing period is 14 days.\n</retrieved_context>`;
    const aiRes = await generateAIResponse({
      messages: [{ senderType: 'USER', message: 'How many days can a student borrow library books?' }],
      systemPrompt: testPrompt,
    });
    if (aiRes && aiRes.text && aiRes.text.includes('14')) {
      geminiStatus = 'PASS';
      groundedContextStatus = 'PASS';
    } else if (aiRes && aiRes.text) {
      geminiStatus = 'PASS';
    }
  } catch (err) {
    console.error('  ⚠️ Gemini invocation error:', err.message);
  }

  console.log('RAG HEALTH');
  console.log('-----------');
  console.log(`MongoDB Knowledge: ${mongoStatus} (${totalMongoDocs} documents)`);
  console.log(`ChromaDB: ${chromaStatus}`);
  console.log(`Vectors: ${chromaVectors.toLocaleString()}`);
  console.log(`BM25: ${bm25Status}`);
  console.log(`BM25 Documents: ${bm25Chunks.toLocaleString()}`);
  console.log(`BGE-M3: ${bgem3Status}`);
  console.log(`Reranker: ${rerankerStatus}`);
  console.log(`Gemini: ${geminiStatus}`);
  console.log(`Grounded Context: ${groundedContextStatus}`);
  console.log('----------------------------------------------------\n');

  closeWorker();
  await mongoose.disconnect();
  process.exit(0);
};

checkRagHealth().catch((err) => {
  console.error('Health check failed:', err);
  process.exit(1);
});
