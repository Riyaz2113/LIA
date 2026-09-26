require('dotenv').config();
const mongoose = require('mongoose');
const { generateGroundedResponse } = require('../src/services/rag/ragService');

async function testScenarios() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Testing Core Diagnostic Scenarios:\n');

  // Test 1: Original test
  console.log('1. "What is the IV-I AIML timetable?"');
  const t1 = await generateGroundedResponse({ query: 'What is the IV-I AIML timetable?' });
  console.log('Top Source:', t1.sources?.[0]?.metadata?.source, '(p.' + t1.sources?.[0]?.metadata?.pageNumber + ')');
  console.log('Passes:', t1.sources?.[0]?.metadata?.source?.includes('TIME TABLE') && t1.text.length > 50 ? '✅ PASS' : '❌ FAIL');

  // Test 2: R23 regulations
  console.log('\n2. "According to the R23 regulations, what are the relevant academic regulations?"');
  const t2 = await generateGroundedResponse({ query: 'According to the R23 regulations, what are the relevant academic regulations?' });
  console.log('Top Source:', t2.sources?.[0]?.metadata?.source, '(p.' + t2.sources?.[0]?.metadata?.pageNumber + ')');
  console.log('Passes:', t2.sources?.[0]?.metadata?.source?.includes('R23-REGULATIONS') && t2.text.length > 50 ? '✅ PASS' : '❌ FAIL');

  // Test 3: Unknown question
  console.log('\n3. "What is the exact secret swimming pool membership fee at VLITS for year 2099?"');
  const t3 = await generateGroundedResponse({ query: 'What is the exact secret swimming pool membership fee at VLITS for year 2099?' });
  console.log('Response excerpt:', t3.text.slice(0, 150));
  const declines = t3.text.toLowerCase().includes("couldn't find") || t3.text.toLowerCase().includes("could not find") || t3.text.toLowerCase().includes("not available") || t3.text.toLowerCase().includes("could not verify");
  console.log('Passes (Zero Hallucination):', declines ? '✅ PASS' : '❌ FAIL');

  await mongoose.disconnect();
}

testScenarios().catch(console.error);
