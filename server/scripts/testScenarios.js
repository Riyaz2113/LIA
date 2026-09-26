require('dotenv').config();
const { generateGroundedResponse } = require('../src/services/rag/ragService');

async function runTests() {
  console.log('==================================================');
  console.log('🧪 TESTING RAG PIPELINE GROUNDING SCENARIOS');
  console.log('==================================================\n');

  // Test 1: Impossible / Unknown Question
  console.log('1. TEST IMPOSSIBLE / UNKNOWN QUESTION:');
  const q1 = 'What is the official VLITS rule for a fictional department called Quantum Robotics Department?';
  console.log('Query:', q1);
  const res1 = await generateGroundedResponse({ query: q1 });
  console.log('Sources:', res1.sources.length);
  console.log('Response:\n', res1.text);
  console.log('\n--------------------------------------------------\n');

  // Test 2: Timetable Document-Only Question
  console.log('2. TEST TIMETABLE QUESTION:');
  const q2 = 'What is the IV-I AIML timetable?';
  console.log('Query:', q2);
  const res2 = await generateGroundedResponse({ query: q2 });
  console.log('Sources:', res2.sources.map(s => `${s.metadata?.title || s.metadata?.source} (p.${s.metadata?.pageNumber})`));
  console.log('Response:\n', res2.text);
  console.log('\n--------------------------------------------------\n');

  // Test 3: R23 Regulations Question
  console.log('3. TEST R23 REGULATIONS QUESTION:');
  const q3 = 'What are the promotion rules and credit requirements in R23 regulations?';
  console.log('Query:', q3);
  const res3 = await generateGroundedResponse({ query: q3 });
  console.log('Sources:', res3.sources.map(s => `${s.metadata?.title || s.metadata?.source} (p.${s.metadata?.pageNumber})`));
  console.log('Response:\n', res3.text);
  console.log('\n--------------------------------------------------\n');

  // Test 4: Multilingual Questions (Telugu, Hindi, Hinglish)
  console.log('4. TEST MULTILINGUAL:');
  const qTelugu = 'కళాశాలలో హాస్టల్ ఫీజు వివరాలు ఏమిటి?';
  console.log('Query (Telugu):', qTelugu);
  const resTelugu = await generateGroundedResponse({ query: qTelugu });
  console.log('Telugu Sources:', resTelugu.sources.map(s => s.metadata?.title || s.metadata?.source));
  console.log('Telugu Response:\n', resTelugu.text);

  const qHindi = 'कॉलेज में प्लेसमेंट के लिए क्या नियम हैं?';
  console.log('\nQuery (Hindi):', qHindi);
  const resHindi = await generateGroundedResponse({ query: qHindi });
  console.log('Hindi Sources:', resHindi.sources.map(s => s.metadata?.title || s.metadata?.source));
  console.log('Hindi Response:\n', resHindi.text);

  console.log('\n==================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
