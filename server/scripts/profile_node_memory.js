/**
 * profile_node_memory.js
 * Empirical Node.js Memory Profiler for LIA Server & BM25 Index.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const formatMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const runNodeProfile = async () => {
  console.log('=' .repeat(60));
  console.log('🔬 EMPIRICAL NODE.JS PROCESS & BM25 MEMORY PROFILER');
  console.log('=' .repeat(60));

  // 1. Initial Node.js Baseline
  const baseMem = process.memoryUsage();
  console.log(`1. Baseline Node.js Process RSS: ${formatMB(baseMem.rss)} MB (Heap: ${formatMB(baseMem.heapUsed)} MB)`);

  // 2. Load BM25 Service & Index
  const bm25Service = require('../src/services/rag/bm25Service');
  await bm25Service.init();
  const bm25Count = bm25Service.count();
  const bm25Mem = process.memoryUsage();
  const deltaBm25Rss = (bm25Mem.rss - baseMem.rss) / (1024 * 1024);
  const deltaBm25Heap = (bm25Mem.heapUsed - baseMem.heapUsed) / (1024 * 1024);
  console.log(`2. BM25 In-Memory Index (${bm25Count} chunks): ${formatMB(bm25Mem.rss)} MB (+${deltaBm25Rss.toFixed(2)} MB RSS, +${deltaBm25Heap.toFixed(2)} MB Heap)`);

  // 3. Load Mongoose & Models
  require('../src/models/KnowledgeDocument');
  require('../src/models/User');
  require('../src/models/ChatConversation');
  require('../src/models/ChatMessage');
  const modelsMem = process.memoryUsage();
  console.log(`3. With Mongoose Schemas & Express Services: ${formatMB(modelsMem.rss)} MB (Heap: ${formatMB(modelsMem.heapUsed)} MB)`);

  // 4. BM25 Search Operation Peak
  const query = 'What is the IV-I AIML timetable?';
  const t0 = performance.now();
  const searchResults = await bm25Service.search(query, 15);
  const t1 = performance.now();
  const opMem = process.memoryUsage();
  console.log(`4. Peak during BM25 Search (${searchResults.length} matches): ${formatMB(opMem.rss)} MB in ${(t1 - t0).toFixed(2)}ms`);

  const results = {
    baseline_node_rss_mb: parseFloat(formatMB(baseMem.rss)),
    bm25_index_heap_mb: parseFloat(deltaBm25Heap.toFixed(2)),
    bm25_total_chunks: bm25Count,
    node_full_server_rss_mb: parseFloat(formatMB(modelsMem.rss)),
    node_full_server_heap_mb: parseFloat(formatMB(modelsMem.heapUsed)),
  };

  fs.writeFileSync('memory_profile_node.json', JSON.stringify(results, null, 2));
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 TOTAL STEADY-STATE NODE.JS PROCESS RSS: ${formatMB(modelsMem.rss)} MB`);
  console.log('=' .repeat(60));
};

runNodeProfile().catch(console.error);
