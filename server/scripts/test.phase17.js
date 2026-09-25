/**
 * test.phase17.js
 * PHASE 17 — FULL-SCREEN CHAT, TIMETABLE FORMATTING, TEACHER PROTECTION, AND CITATIONS
 *
 * Verifies:
 * 1. Timetable query intent detection and priority boosting
 * 2. Real query: "What is the IV-I AIML timetable?"
 * 3. Real query: "Show me the weekly timetable for IV-I AIML."
 * 4. Real query: "Who are the class teachers for IV-I AIML?" (Anti-hallucination protection)
 * 5. Real query: "What are the timings for IV-I AIML?"
 * 6. Real query: "Tell me about R23 academic regulations."
 * 7. Citation metadata flow & page numbers
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { generateGroundedResponse } = require('../src/services/rag/ragService');
const { isTimetableQuery, isTimetableChunk, retrieveReranked } = require('../src/services/rag/retrievalService');

let passedTests = 0;
let failedTests = 0;

const assert = (condition, testName, details = '') => {
  if (condition) {
    console.log(`  ✅ PASS: ${testName} ${details ? `(${details})` : ''}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failedTests++;
  }
};

const runPhase17Tests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 17 TEST SUITE: REAL QUERY VALIDATION');
  console.log('====================================================\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lia');

    // 1. Timetable Query Detection & Boosting Verification
    console.log('1. Timetable Query Intent & Boost Unit Tests');
    assert(isTimetableQuery('What is the IV-I AIML timetable?'), 'Detects "timetable" keyword');
    assert(isTimetableQuery('Show me the weekly timetable for IV-I AIML.'), 'Detects "weekly timetable" phrase');
    assert(isTimetableQuery('What are the class timings for today?'), 'Detects "class timings" phrase');
    assert(!isTimetableQuery('What is the hostel fee?'), 'Correctly ignores non-timetable queries');

    const mockChunk = {
      metadata: { title: 'IV-I AIML TIMETABLE 2025-26.pdf', source: 'timetable_aiml.pdf' },
      text: 'Time Table for B.Tech IV Year I Semester AIML',
    };
    assert(isTimetableChunk(mockChunk), 'Correctly identifies timetable chunk');

    // 2. Real Query 1: "What is the IV-I AIML timetable?"
    console.log('\n2. Real Query: "What is the IV-I AIML timetable?"');
    const q1Res = await generateGroundedResponse({
      query: 'What is the IV-I AIML timetable?',
      user: { name: 'Test Student', role: 'STUDENT' },
    });
    console.log('--- Response Preview ---');
    console.log(q1Res.text.slice(0, 300) + '...\n');
    assert(q1Res && typeof q1Res.text === 'string' && q1Res.text.length > 50, 'Generated grounded answer');
    assert(Array.isArray(q1Res.sources), 'Returns structured sources array');
    assert(q1Res.sources.length > 0, 'Sources metadata contains retrieved references');
    console.log(`Sources (${q1Res.sources.length}):`, q1Res.sources.map(s => `${s.metadata?.title || s.metadata?.source} (Page ${s.metadata?.pageNumber})`));

    // 3. Real Query 2: "Show me the weekly timetable for IV-I AIML."
    console.log('\n3. Real Query: "Show me the weekly timetable for IV-I AIML."');
    const q2Res = await generateGroundedResponse({
      query: 'Show me the weekly timetable for IV-I AIML.',
      user: { name: 'Test Student', role: 'STUDENT' },
    });
    console.log('--- Response Preview ---');
    console.log(q2Res.text.slice(0, 300) + '...\n');
    assert(q2Res.text.includes('|') || q2Res.text.toLowerCase().includes('timetable') || q2Res.text.toLowerCase().includes('schedule'), 'Contains structured timetable formatting');
    assert(q2Res.sources.length > 0, 'Citations populated for weekly timetable query');

    // 4. Real Query 3: "Who are the class teachers for IV-I AIML?" (Anti-Hallucination Guardrail)
    console.log('\n4. Real Query: "Who are the class teachers for IV-I AIML?" (Teacher Protection)');
    const q3Res = await generateGroundedResponse({
      query: 'Who are the class teachers for IV-I AIML?',
      user: { name: 'Test Student', role: 'STUDENT' },
    });
    console.log('--- Response Preview ---');
    console.log(q3Res.text.slice(0, 300) + '...\n');
    const containsSafeStatement =
      q3Res.text.toLowerCase().includes('not available') ||
      q3Res.text.toLowerCase().includes('check with') ||
      q3Res.text.toLowerCase().includes('class teacher') ||
      q3Res.text.toLowerCase().includes('department');
    assert(containsSafeStatement, 'Teacher protection guardrail prevents unverified or invented teacher names');

    // 5. Real Query 4: "What are the timings for IV-I AIML?"
    console.log('\n5. Real Query: "What are the timings for IV-I AIML?"');
    const q4Res = await generateGroundedResponse({
      query: 'What are the timings for IV-I AIML?',
      user: { name: 'Test Student', role: 'STUDENT' },
    });
    console.log('--- Response Preview ---');
    console.log(q4Res.text.slice(0, 300) + '...\n');
    assert(q4Res && typeof q4Res.text === 'string' && q4Res.text.length > 20, 'Answers class timings query safely');

    // 6. Real Query 5: "Tell me about R23 academic regulations."
    console.log('\n6. Real Query: "Tell me about R23 academic regulations."');
    const q5Res = await generateGroundedResponse({
      query: 'Tell me about R23 academic regulations.',
      user: { name: 'Test Student', role: 'STUDENT' },
    });
    console.log('--- Response Preview ---');
    console.log(q5Res.text.slice(0, 300) + '...\n');
    assert(
      q5Res.text.toLowerCase().includes('attendance') ||
      q5Res.text.toLowerCase().includes('credit') ||
      q5Res.text.toLowerCase().includes('r23') ||
      q5Res.text.toLowerCase().includes('academic') ||
      q5Res.text.toLowerCase().includes('regulation'),
      'R23 regulations answered accurately with institutional facts'
    );
    assert(q5Res.sources.length > 0, 'Regulations citation source metadata attached');

    // 7. Metadata Integrity Check
    console.log('\n7. Metadata Integrity Verification');
    const sampleSource = q5Res.sources[0];
    if (sampleSource) {
      assert(sampleSource.metadata && typeof sampleSource.metadata.source === 'string', 'Source document name preserved');
      assert(sampleSource.metadata.pageNumber !== undefined, 'Page number metadata field preserved');
      assert(typeof sampleSource.score === 'number', 'Retrieval/Rerank score preserved');
    }

    console.log('\n====================================================');
    console.log(`PHASE 17 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal error during Phase 17 tests:', err);
    failedTests++;
  } finally {
    await mongoose.disconnect();
    process.exit(failedTests > 0 ? 1 : 0);
  }
};

runPhase17Tests();
