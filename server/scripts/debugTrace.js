require('dotenv').config();
const mongoose = require('mongoose');
const { retrieveKnowledge, retrieveHybrid, retrieveReranked, isTimetableQuery } = require('../src/services/rag/retrievalService');
const bm25Service = require('../src/services/rag/bm25Service');
const { generateGroundedResponse } = require('../src/services/rag/ragService');

async function debugQuery(query) {
  console.log('====================================================');
  console.log(`TRACE FOR QUERY: "${query}"`);
  console.log('====================================================');

  console.log('1. Timetable Query Detection:', isTimetableQuery(query));

  // BM25
  await bm25Service.init();
  const bm25Results = await bm25Service.search(query, 10);
  console.log(`\n2. BM25 Top ${bm25Results.length} Results:`);
  bm25Results.forEach((r, i) => {
    console.log(`  [${i+1}] Score: ${r.score?.toFixed(4)} | Doc: ${r.metadata?.source || r.metadata?.title} | Page: ${r.metadata?.pageNumber} | Text excerpt: ${r.text.slice(0, 100).replace(/\n/g, ' ')}`);
  });

  // Dense
  const vectorResults = await retrieveKnowledge(query, { topK: 10 });
  console.log(`\n3. Dense Vector Top ${vectorResults.length} Results:`);
  vectorResults.forEach((r, i) => {
    console.log(`  [${i+1}] Score: ${r.score?.toFixed(4)} | Doc: ${r.metadata?.source || r.metadata?.title} | Page: ${r.metadata?.pageNumber} | Text excerpt: ${r.text.slice(0, 100).replace(/\n/g, ' ')}`);
  });

  // Hybrid RRF
  const hybridResults = await retrieveHybrid(query, { vectorTopK: 15, bm25TopK: 15, finalTopK: 15 });
  console.log(`\n4. Hybrid RRF Top ${hybridResults.length} Results:`);
  hybridResults.forEach((r, i) => {
    console.log(`  [${i+1}] RRF: ${r.rrfScore?.toFixed(5)} | Vector: ${r.vectorScore?.toFixed(4)} | BM25: ${r.bm25Score?.toFixed(4)} | Doc: ${r.metadata?.source || r.metadata?.title} | Page: ${r.metadata?.pageNumber}`);
  });

  // Reranked
  const rerankedOutput = await retrieveReranked(query, { vectorTopK: 15, bm25TopK: 15, hybridTopK: 15, rerankTopK: 5 });
  console.log(`\n5. Cross-Encoder Reranked Candidates (${rerankedOutput.candidates.length}):`);
  rerankedOutput.candidates.forEach((r, i) => {
    console.log(`  [${i+1}] RerankerScore: ${r.rerankerScore?.toFixed(4)} | Doc: ${r.metadata?.source || r.metadata?.title} | Page: ${r.metadata?.pageNumber}`);
  });

  // Full Grounded Response
  console.log('\n6. Full Grounded Response:');
  const groundedRes = await generateGroundedResponse({
    query,
    user: { name: 'Student', role: 'STUDENT' }
  });
  console.log('Grounded Answer Text:\n', groundedRes.text);
  console.log('Sources:', groundedRes.sources.map(s => `${s.metadata?.title || s.metadata?.source} (p.${s.metadata?.pageNumber}) [score: ${s.score}]`));
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to Atlas');
  await debugQuery('What is the IV-I AIML timetable?');
  await debugQuery('aiml 4th year time table');
  await mongoose.disconnect();
}

run().catch(console.error);
