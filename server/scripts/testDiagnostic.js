require('dotenv').config();
const { retrieveKnowledge, retrieveHybrid, retrieveReranked } = require('../src/services/rag/retrievalService');
const { generateGroundedResponse } = require('../src/services/rag/ragService');

async function test() {
  const query = 'What is the IV-I AIML timetable?';
  console.log('Testing query:', query);
  
  console.log('\n--- Dense Vector Retrieval ---');
  const vec = await retrieveKnowledge(query, { topK: 5 });
  console.log('Vector results count:', vec.length);
  vec.forEach((v, i) => console.log(` [${i+1}] Source: ${v.metadata?.source}, Score: ${v.score}, Excerpt: ${v.text.slice(0, 120)}...`));

  console.log('\n--- Reranked Retrieval ---');
  const reranked = await retrieveReranked(query, { vectorTopK: 10, bm25TopK: 10, hybridTopK: 10, rerankTopK: 5 });
  console.log('Reranked candidates count:', reranked.candidates.length);
  reranked.candidates.forEach((c, i) => console.log(` [${i+1}] Source: ${c.metadata?.source}, RerankScore: ${c.rerankerScore}, Excerpt: ${c.text.slice(0, 120)}...`));

  console.log('\n--- Full Grounded Response ---');
  const resp = await generateGroundedResponse({ query });
  console.log('Response Provider:', resp.provider);
  console.log('Response Model:', resp.model);
  console.log('Response Sources count:', resp.sources.length);
  console.log('Response Text:\n', resp.text);

  process.exit(0);
}
test().catch(err => { console.error(err); process.exit(1); });
