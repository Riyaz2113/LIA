/**
 * test.phase15.js
 * PHASE 15 — CROSS-ENCODER RERANKING TEST SUITE
 *
 * Verifies:
 * 1. Cross-Encoder service initialization
 * 2. Model loading & memory persistence (BAAI/bge-reranker-v2-m3)
 * 3. CPU/GPU device detection
 * 4. Candidate pair scoring (joint query-passage interaction)
 * 5. English reranking
 * 6. Telugu multilingual reranking
 * 7. Hindi multilingual reranking
 * 8. Candidate metadata preservation
 * 9. Vector score preservation
 * 10. BM25 score preservation
 * 11. RRF score preservation
 * 12. Reranker score generation (raw float logits/probabilities)
 * 13. Final top-K limit enforcement (slicing to configured topK)
 * 14. Empty candidate handling (returns [] gracefully)
 * 15. Invalid / blank candidate handling
 * 16. Hybrid -> Cross-Encoder end-to-end retrieval flow (retrieveReranked)
 * 17. Model instance reuse across sequential queries without reload
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const KnowledgeDocument = require('../src/models/KnowledgeDocument');
const { rerankCandidates } = require('../src/services/rag/rerankerService');
const { retrieveReranked, retrieveHybrid } = require('../src/services/rag/retrievalService');
const chromaService = require('../src/services/rag/chromaService');
const { ingestDocument, deleteDocument } = require('../src/services/rag/ingestionService');

const TEST_DIR = path.join(__dirname, '../temp_test_phase15');

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

const runPhase15Tests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 15 TEST SUITE: CROSS-ENCODER RERANKING');
  console.log('====================================================\n');

  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  // Setup test documents in English, Telugu, and Hindi
  const docPathEng = path.join(TEST_DIR, 'VLITS_Exam_Condonation_Policy.txt');
  const docContentEng = `
Vignan's Lara Institute of Technology & Science - Examination & Condonation Rules
1. Mandatory Attendance: 75% aggregate attendance is strictly required for appearing in semester end exams.
2. Condonation Eligibility: Students securing between 65% and 74% attendance may apply for condonation on valid medical grounds.
3. Condonation Fee: A prescribed fee of Rs. 1,500 must be submitted along with government medical officer certificate.
4. Detention: Attendance below 65% results in immediate detention with no condonation permitted under any circumstances.
  `.trim();

  const docPathTel = path.join(TEST_DIR, 'VLITS_Hostel_Mess_Telugu.txt');
  const docContentTel = `
విజ్ఞాన్ లారా ఇంజనీరింగ్ కళాశాల - హాస్టల్ మెస్ సమయాలు (Hostel Mess Timings)
1. అల్పాహారం (Breakfast): ఉదయం 7:30 నుండి 9:00 వరకు.
2. మధ్యాహ్న భోజనం (Lunch): మధ్యాహ్నం 12:30 నుండి 2:00 వరకు.
3. రాత్రి భోజనం (Dinner): రాత్రి 7:30 నుండి 9:00 వరకు.
4. హాస్టల్ విద్యార్థులు రాత్రి 8:30 గంటలలోపు హాస్టల్ బ్లాకుకు చేరుకోవాలి.
  `.trim();

  const docPathHin = path.join(TEST_DIR, 'VLITS_Library_Hindi.txt');
  const docContentHin = `
विज्ञान लारा प्रौद्योगिकी एवं विज्ञान संस्थान - पुस्तकालय नियम (Library Rules)
1. पुस्तकालय खुलने का समय: सुबह 8:00 बजे से रात 8:00 बजे तक।
2. प्रत्येक छात्र 14 दिनों के लिए अधिकतम 4 पुस्तकें ले सकता है।
3. विलंब शुल्क: 2 रुपये प्रतिदिन प्रति पुस्तक।
  `.trim();

  fs.writeFileSync(docPathEng, docContentEng, 'utf8');
  fs.writeFileSync(docPathTel, docContentTel, 'utf8');
  fs.writeFileSync(docPathHin, docContentHin, 'utf8');

  try {
    // 1. Connect to MongoDB Atlas
    console.log('1. Database Connection & System Setup');
    await mongoose.connect(process.env.MONGODB_URI);
    assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connected');

    // 2. Health & Model Device Detection
    console.log('\n2. ChromaDB & Model Device Health Check');
    const health = await chromaService.healthCheck();
    assert(health.status === 'HEALTHY', 'Service healthy', `Device: ${health.device}`);
    assert(health.rerankerModel === 'BAAI/bge-reranker-v2-m3', 'Loaded Cross-Encoder model BAAI/bge-reranker-v2-m3');

    // 3. Test Candidate Pair Scoring
    console.log('\n3. Candidate Pair Scoring & Reranker Score Generation');
    const testQuery = 'What is the attendance condonation fee and percentage?';
    const mockCandidates = [
      {
        documentId: 'doc_att',
        chunkIndex: 0,
        text: 'Condonation Fee is Rs. 1,500 for students with attendance between 65% and 74%.',
        vectorScore: 0.85,
        bm25Score: 4.2,
        rrfScore: 0.032,
        metadata: { source: 'exam_policy.txt', category: 'EXAM' },
      },
      {
        documentId: 'doc_irrelevant',
        chunkIndex: 0,
        text: 'The college cafeteria serves fresh snacks and beverages from 9 AM to 5 PM.',
        vectorScore: 0.70,
        bm25Score: 0.5,
        rrfScore: 0.015,
        metadata: { source: 'cafeteria.txt', category: 'CAMPUS' },
      },
      {
        documentId: 'doc_sports',
        chunkIndex: 0,
        text: 'Annual sports day features cricket, volleyball, and badminton tournaments.',
        vectorScore: 0.65,
        bm25Score: 0.0,
        rrfScore: 0.012,
        metadata: { source: 'sports.txt', category: 'CAMPUS' },
      },
    ];

    const rerankedMock = await rerankCandidates(testQuery, mockCandidates, { topK: 3 });
    assert(Array.isArray(rerankedMock) && rerankedMock.length === 3, 'Reranked all candidate pairs');
    assert(typeof rerankedMock[0].rerankerScore === 'number', 'Generated raw numeric rerankerScore', `Score: ${rerankedMock[0].rerankerScore.toFixed(4)}`);
    assert(rerankedMock[0].documentId === 'doc_att', 'Highly relevant passage ranked #1 by Cross-Encoder');
    assert(rerankedMock[0].rerankerScore > rerankedMock[1].rerankerScore, 'Relevant passage score strictly greater than irrelevant passage');

    // 4. Test Score Preservation
    console.log('\n4. Multi-Score Preservation (Vector, BM25, RRF, Reranker)');
    const topCandidate = rerankedMock[0];
    assert(topCandidate.vectorScore === 0.85, 'Preserved original vectorScore (0.85)');
    assert(topCandidate.bm25Score === 4.2, 'Preserved original bm25Score (4.2)');
    assert(topCandidate.rrfScore === 0.032, 'Preserved original rrfScore (0.032)');
    assert(topCandidate.metadata && topCandidate.metadata.source === 'exam_policy.txt', 'Preserved candidate metadata intact');

    // 5. Test Top-K Limit Enforcement
    console.log('\n5. Final Top-K Limit Enforcement');
    const top1Only = await rerankCandidates(testQuery, mockCandidates, { topK: 1 });
    assert(top1Only.length === 1, 'topK=1 limits output to exactly 1 candidate');

    // 6. Test Empty and Invalid Candidate Handling
    console.log('\n6. Edge Case & Invalid Input Handling');
    const emptyResult = await rerankCandidates(testQuery, []);
    assert(Array.isArray(emptyResult) && emptyResult.length === 0, 'Empty candidate list returns [] safely');

    const emptyQueryResult = await rerankCandidates('', mockCandidates);
    assert(Array.isArray(emptyQueryResult) && emptyQueryResult.length === 0, 'Empty query string returns [] safely');

    // 7. Test Ingesting Knowledge Base for End-to-End Retrieval
    console.log('\n7. Ingesting Multilingual Test Documents');
    await KnowledgeDocument.deleteMany({
      source: { $in: ['VLITS_Exam_Condonation_Policy.txt', 'VLITS_Hostel_Mess_Telugu.txt', 'VLITS_Library_Hindi.txt'] },
    });

    const ingEng = await ingestDocument(docPathEng, { category: 'EXAM' });
    const ingTel = await ingestDocument(docPathTel, { category: 'HOSTEL' });
    const ingHin = await ingestDocument(docPathHin, { category: 'ACADEMIC' });
    assert(ingEng.status === 'COMPLETED' && ingTel.status === 'COMPLETED' && ingHin.status === 'COMPLETED', 'Ingested English, Telugu, and Hindi test documents');

    // 8. Test End-to-End English Retrieval + Reranking
    console.log('\n8. End-to-End English Multi-Stage Retrieval (retrieveReranked)');
    const engRetrieval = await retrieveReranked('minimum attendance required for semester examinations and fee', {
      vectorTopK: 5,
      bm25TopK: 5,
      hybridTopK: 5,
      rerankTopK: 3,
    });
    assert(engRetrieval && engRetrieval.candidates.length > 0, 'retrieveReranked returned candidates');
    assert(engRetrieval.candidates[0].text.includes('1,500') || engRetrieval.candidates[0].text.includes('Condonation'), 'Top reranked English candidate contains exact condonation policy details');
    assert(engRetrieval.candidates[0].rerankerScore !== undefined, 'Candidate contains valid rerankerScore');

    // 9. Test End-to-End Telugu Retrieval + Reranking
    console.log('\n9. Telugu Multilingual Multi-Stage Retrieval');
    const telRetrieval = await retrieveReranked('హాస్టల్ విద్యార్థులకు రాత్రి భోజనం సమయం ఏమిటి?', {
      vectorTopK: 5,
      bm25TopK: 5,
      hybridTopK: 5,
      rerankTopK: 3,
    });
    assert(telRetrieval && telRetrieval.candidates.length > 0, 'Telugu retrieveReranked returned candidates');
    assert(telRetrieval.candidates[0].text.includes('రాత్రి భోజనం') || telRetrieval.candidates[0].text.includes('7:30'), 'Top reranked Telugu candidate contains exact dinner timing');

    // 10. Test End-to-End Hindi Retrieval + Reranking
    console.log('\n10. Hindi Multilingual Multi-Stage Retrieval');
    const hinRetrieval = await retrieveReranked('पुस्तकालय से कितनी पुस्तकें ली जा सकती हैं और विलंब शुल्क क्या है?', {
      vectorTopK: 5,
      bm25TopK: 5,
      hybridTopK: 5,
      rerankTopK: 3,
    });
    assert(hinRetrieval && hinRetrieval.candidates.length > 0, 'Hindi retrieveReranked returned candidates');
    assert(hinRetrieval.candidates[0].text.includes('4 पुस्तकें') || hinRetrieval.candidates[0].text.includes('2 रुपये'), 'Top reranked Hindi candidate contains exact book limit & fine');

    // 11. Test Model Instance Reuse Across Sequential Invocations
    console.log('\n11. Model Persistence & Instance Reuse Verification');
    const t0 = Date.now();
    await rerankCandidates('quick query', mockCandidates, { topK: 2 });
    const elapsed = Date.now() - t0;
    assert(elapsed < 2000, 'Subsequent rerank query executed rapidly without model reload', `${elapsed}ms`);

    // Cleanup test files & documents
    await deleteDocument(ingEng.documentId);
    await deleteDocument(ingTel.documentId);
    await deleteDocument(ingHin.documentId);

    if (fs.existsSync(docPathEng)) fs.unlinkSync(docPathEng);
    if (fs.existsSync(docPathTel)) fs.unlinkSync(docPathTel);
    if (fs.existsSync(docPathHin)) fs.unlinkSync(docPathHin);
    if (fs.existsSync(TEST_DIR)) fs.rmdirSync(TEST_DIR);

    console.log('\n====================================================');
    console.log(`PHASE 15 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal error during Phase 15 tests:', err);
    failedTests++;
  } finally {
    await mongoose.disconnect();
    process.exit(failedTests > 0 ? 1 : 0);
  }
};

runPhase15Tests();
