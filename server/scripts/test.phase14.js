/**
 * test.phase14.js
 * PHASE 14 — HYBRID RETRIEVAL (BM25 + BGE-M3 + RRF) TEST SUITE
 *
 * Verifies:
 * 1. BM25 index initialization & persistence
 * 2. BM25 chunk indexing & vocabulary stats
 * 3. BM25 exact keyword search
 * 4. BGE-M3 Vector retrieval (ChromaDB)
 * 5. Reciprocal Rank Fusion (RRF) math & score computation (1 / (k + rank))
 * 6. Duplicate candidate rank fusion (combining dense + sparse matches)
 * 7. Candidate metadata preservation (source, title, page, section, hashes)
 * 8. Final top-k truncation limit enforcement
 * 9. English hybrid retrieval
 * 10. Telugu hybrid retrieval (lexical + semantic)
 * 11. Hindi hybrid retrieval (lexical + semantic)
 * 12. Document removal (clean sync across ChromaDB, BM25, and MongoDB)
 * 13. BM25 index rebuild CLI functionality
 * 14. End-to-end retrieveHybrid service integration
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const KnowledgeDocument = require('../src/models/KnowledgeDocument');
const bm25Service = require('../src/services/rag/bm25Service');
const { reciprocalRankFusion } = require('../src/services/rag/rrf');
const chromaService = require('../src/services/rag/chromaService');
const { ingestDocument, deleteDocument } = require('../src/services/rag/ingestionService');
const { retrieveKnowledge, retrieveHybrid } = require('../src/services/rag/retrievalService');

const TEST_DIR = path.join(__dirname, '../temp_test_phase14');

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

const runPhase14Tests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 14 TEST SUITE: HYBRID RETRIEVAL (BM25 + BGE-M3 + RRF)');
  console.log('====================================================\n');

  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  // Create multilingual test documents
  const engDocPath = path.join(TEST_DIR, 'VLITS_Hostel_Fee_Policy.txt');
  const engDocContent = `
Vignan's Lara Institute of Technology & Science - Hostel Rules & Fee Structure
Hostel Fee for Academic Year 2026-2027:
1. AC Rooms with attached washroom: Rs. 95,000 per academic year.
2. Non-AC 3-sharing rooms: Rs. 70,000 per academic year.
3. Caution deposit: Rs. 5,000 (refundable at the end of the degree).
4. Mess timings: Breakfast 7:30 AM - 9:00 AM, Lunch 12:30 PM - 2:00 PM, Dinner 7:30 PM - 9:00 PM.
5. In-time for hostel residents: All students must report to their respective hostel blocks before 8:30 PM sharp.
Gate passes are mandatory for day outings on weekends.
  `.trim();

  const telDocPath = path.join(TEST_DIR, 'VLITS_Library_Rules_Telugu.txt');
  const telDocContent = `
విజ్ఞాన్ లారా ఇంజనీరింగ్ కళాశాల - గ్రంథాలయ నిబంధనలు (Library Rules)
1. గ్రంథాలయ సమయాలు: ఉదయం 8:00 నుండి రాత్రి 8:00 వరకు.
2. ప్రతి విద్యార్థి ఒకేసారి 4 పుస్తకాలను 14 రోజుల పాటు తీసుకోవచ్చు.
3. పుస్తకం ఆలస్యంగా ఇస్తే రోజుకు రూ. 2 అపరాధ రుసుము (fine) చెల్లించాలి.
4. డిజిటల్ లైబ్రరీలో 50 కంప్యూటర్లు విద్యార్థుల రీసెర్చ్ కోసం అందుబాటులో ఉన్నాయి.
  `.trim();

  const hinDocPath = path.join(TEST_DIR, 'VLITS_Placement_Hindi.txt');
  const hinDocContent = `
विज्ञान लारा प्रौद्योगिकी एवं विज्ञान संस्थान - प्लेसमेंट दिशानिर्देश (Placement Guidelines)
1. टीसीएस, इंफोसिस और विप्रो जैसी शीर्ष आईटी कंपनियां प्लेसमेंट ड्राइव आयोजित करती हैं।
2. प्लेसमेंट के लिए न्यूनतम 6.5 सीजीपीए आवश्यक है।
3. छात्रों के पास कोई बैकलॉग नहीं होना चाहिए।
  `.trim();

  fs.writeFileSync(engDocPath, engDocContent, 'utf8');
  fs.writeFileSync(telDocPath, telDocContent, 'utf8');
  fs.writeFileSync(hinDocPath, hinDocContent, 'utf8');

  try {
    // 1. Connect to MongoDB Atlas
    console.log('1. Database Connection & System Setup');
    await mongoose.connect(process.env.MONGODB_URI);
    assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connected');

    // 2. Test BM25 Service Initialization
    console.log('\n2. BM25 Index Initialization & Persistence');
    await bm25Service.init();
    assert(bm25Service.isInitialized === true, 'BM25 Service initialized successfully');

    // 3. Test Ingesting Test Documents
    console.log('\n3. Multi-Document Ingestion (ChromaDB + BM25 + MongoDB)');
    await KnowledgeDocument.deleteMany({
      source: { $in: ['VLITS_Hostel_Fee_Policy.txt', 'VLITS_Library_Rules_Telugu.txt', 'VLITS_Placement_Hindi.txt'] },
    });

    const engIngest = await ingestDocument(engDocPath, { category: 'HOSTEL' });
    assert(engIngest.status === 'COMPLETED', 'Ingested English Hostel Policy doc', `${engIngest.chunkCount} chunks`);

    const telIngest = await ingestDocument(telDocPath, { category: 'ACADEMIC' });
    assert(telIngest.status === 'COMPLETED', 'Ingested Telugu Library Rules doc', `${telIngest.chunkCount} chunks`);

    const hinIngest = await ingestDocument(hinDocPath, { category: 'PLACEMENT' });
    assert(hinIngest.status === 'COMPLETED', 'Ingested Hindi Placement doc', `${hinIngest.chunkCount} chunks`);

    const bm25CountAfterIngest = bm25Service.count();
    assert(bm25CountAfterIngest >= 3, 'BM25 index contains ingested chunks', `Count: ${bm25CountAfterIngest}`);

    // 4. Test BM25 Exact Keyword Retrieval
    console.log('\n4. BM25 Exact Keyword Retrieval');
    const bm25Results = await bm25Service.search('AC Rooms 95,000 Caution deposit', 5);
    assert(Array.isArray(bm25Results) && bm25Results.length > 0, 'BM25 keyword search returned results');
    assert(bm25Results[0].text.includes('95,000'), 'Top BM25 match contains exact keyword "95,000"');
    assert(typeof bm25Results[0].score === 'number' && bm25Results[0].score > 0, 'BM25 score calculated', `Score: ${bm25Results[0].score.toFixed(4)}`);

    // 5. Test Dense Vector Retrieval
    console.log('\n5. Dense Vector Retrieval (BGE-M3 + ChromaDB)');
    const vectorResults = await retrieveKnowledge('What is the annual hostel accommodation cost?', { topK: 5 });
    assert(Array.isArray(vectorResults) && vectorResults.length > 0, 'Dense vector search returned results');
    assert(vectorResults[0].text.toLowerCase().includes('hostel'), 'Top dense vector result is semantically relevant');

    // 6. Test RRF Calculation & Math
    console.log('\n6. Reciprocal Rank Fusion (RRF) Calculation');
    const mockVector = [
      { documentId: 'doc1', chunkIndex: 0, text: 'Chunk A', score: 0.9, metadata: { contentHash: 'h1' } },
      { documentId: 'doc2', chunkIndex: 0, text: 'Chunk B', score: 0.8, metadata: { contentHash: 'h2' } },
    ];
    const mockBM25 = [
      { documentId: 'doc2', chunkIndex: 0, text: 'Chunk B', score: 4.5, metadata: { contentHash: 'h2' } },
      { documentId: 'doc3', chunkIndex: 0, text: 'Chunk C', score: 3.2, metadata: { contentHash: 'h3' } },
    ];

    const rrfK = 60;
    const fusedMock = reciprocalRankFusion(mockVector, mockBM25, { rrfK, finalTopK: 5 });

    // In mock: doc2 is rank 2 in vector (1/(60+2) = 1/62) and rank 1 in BM25 (1/(60+1) = 1/61) -> total = (1/62 + 1/61) ≈ 0.0325
    // doc1 is rank 1 in vector only (1/61 ≈ 0.01639)
    // doc3 is rank 2 in BM25 only (1/62 ≈ 0.01612)
    // So doc2 must be #1!
    assert(fusedMock[0].documentId === 'doc2', 'Dual-matched candidate (doc2) ranked #1 via RRF fusion');
    assert(fusedMock[0].vectorScore === 0.8 && fusedMock[0].bm25Score === 4.5, 'Preserved both vector and BM25 scores');
    const expectedScoreDoc2 = 1 / (60 + 2) + 1 / (60 + 1);
    assert(Math.abs(fusedMock[0].rrfScore - expectedScoreDoc2) < 0.0001, 'RRF mathematical formula 1/(k+rank) strictly verified');

    // 7. Test Metadata Preservation & Top-K Limit
    console.log('\n7. Candidate Metadata Preservation & Top-K Limit');
    const fusedTop2 = reciprocalRankFusion(mockVector, mockBM25, { rrfK: 60, finalTopK: 2 });
    assert(fusedTop2.length === 2, 'finalTopK=2 limits returned candidates to exactly 2');
    assert(fusedTop2[0].metadata && fusedTop2[0].metadata.contentHash === 'h2', 'Metadata preserved through RRF pipeline');

    // 8. Test End-to-End Hybrid Retrieval (English)
    console.log('\n8. End-to-End Hybrid Retrieval: English Query');
    const hybridEnglish = await retrieveHybrid('What is the in-time and gate pass rule for hostel students?', {
      vectorTopK: 5,
      bm25TopK: 5,
      finalTopK: 3,
      rrfK: 60,
    });
    assert(Array.isArray(hybridEnglish) && hybridEnglish.length > 0, 'Hybrid retrieval returned results');
    assert(hybridEnglish[0].text.includes('8:30 PM') || hybridEnglish[0].text.includes('Gate passes'), 'Top result contains precise hostel curfew details');
    assert(typeof hybridEnglish[0].rrfScore === 'number' && hybridEnglish[0].rrfScore > 0, 'Result contains valid rrfScore', `RRF: ${hybridEnglish[0].rrfScore.toFixed(5)}`);

    // 9. Test Telugu Multilingual Hybrid Retrieval
    console.log('\n9. Telugu Multilingual Hybrid Retrieval');
    const hybridTelugu = await retrieveHybrid('గ్రంథాలయంలో ఎన్ని పుస్తకాలు తీసుకోవచ్చు?', {
      vectorTopK: 5,
      bm25TopK: 5,
      finalTopK: 3,
    });
    assert(Array.isArray(hybridTelugu) && hybridTelugu.length > 0, 'Telugu hybrid retrieval returned results');
    assert(hybridTelugu[0].text.includes('పుస్తకాలను') || hybridTelugu[0].text.includes('నిబంధనలు'), 'Telugu result matched library rules');

    // 10. Test Hindi Multilingual Hybrid Retrieval
    console.log('\n10. Hindi Multilingual Hybrid Retrieval');
    const hybridHindi = await retrieveHybrid('प्लेसमेंट के लिए सीजीपीए की आवश्यकता क्या है?', {
      vectorTopK: 5,
      bm25TopK: 5,
      finalTopK: 3,
    });
    assert(Array.isArray(hybridHindi) && hybridHindi.length > 0, 'Hindi hybrid retrieval returned results');
    assert(hybridHindi[0].text.includes('6.5 सीजीपीए') || hybridHindi[0].text.includes('प्लेसमेंट'), 'Hindi result matched placement requirements');

    // 11. Test Document Removal & Index Synchronization
    console.log('\n11. Document Removal & Index Synchronization');
    const initialBM25Count = bm25Service.count();
    await deleteDocument(telIngest.documentId);

    const afterDelBM25Count = bm25Service.count();
    assert(afterDelBM25Count < initialBM25Count, 'BM25 index removed deleted document chunks', `Remaining: ${afterDelBM25Count}`);

    const deletedDocInMongo = await KnowledgeDocument.findById(telIngest.documentId);
    assert(deletedDocInMongo === null, 'Document deleted from MongoDB Atlas');

    // 12. Test BM25 Index Rebuild
    console.log('\n12. BM25 Index Rebuild Verification');
    const rebuildResult = await bm25Service.rebuild([
      {
        documentId: 'rebuild_doc_1',
        chunkIndex: 0,
        text: 'Vignan Lara coding club conducts weekly competitive programming contests.',
        contentHash: 'reb_hash_1',
      },
      {
        documentId: 'rebuild_doc_2',
        chunkIndex: 0,
        text: 'Robotics lab at VLITS provides IoT kits and 3D printing equipment.',
        contentHash: 'reb_hash_2',
      },
    ]);
    assert(rebuildResult.status === 'REBUILT', 'BM25 index rebuilt successfully');
    assert(bm25Service.count() === 2, 'BM25 count matches newly rebuilt chunks');

    const searchRebuilt = await bm25Service.search('Robotics 3D printing', 2);
    assert(searchRebuilt.length > 0 && searchRebuilt[0].text.includes('Robotics'), 'Search over rebuilt index functions perfectly');

    // Cleanup test files & documents
    await deleteDocument(engIngest.documentId);
    await deleteDocument(hinIngest.documentId);
    if (fs.existsSync(engDocPath)) fs.unlinkSync(engDocPath);
    if (fs.existsSync(telDocPath)) fs.unlinkSync(telDocPath);
    if (fs.existsSync(hinDocPath)) fs.unlinkSync(hinDocPath);
    if (fs.existsSync(TEST_DIR)) fs.rmdirSync(TEST_DIR);

    // Rebuild index from remaining knowledge base
    await bm25Service.rebuild([]);

    console.log('\n====================================================');
    console.log(`PHASE 14 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal error during Phase 14 tests:', err);
    failedTests++;
  } finally {
    await mongoose.disconnect();
    process.exit(failedTests > 0 ? 1 : 0);
  }
};

runPhase14Tests();
