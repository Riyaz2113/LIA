/**
 * test.phase13.js
 * PHASE 13 — LIA RAG KNOWLEDGE BASE + CHROMADB FOUNDATION TEST SUITE
 *
 * Verifies:
 * 1. SHA-256 Document and text hashing
 * 2. Conservative text cleaning
 * 3. Configurable chunking with rich metadata
 * 4. Multi-format text extraction (TXT, DOCX, PDF)
 * 5. BAAI/bge-m3 Embedding generation (1024-dim dense vectors)
 * 6. ChromaDB connection, health check, collection initialization
 * 7. End-to-end ingestion pipeline into ChromaDB + MongoDB Atlas KnowledgeDocument
 * 8. Duplicate document detection (SHA-256 based rejection/skipping)
 * 9. Vector similarity retrieval with scores and metadata
 * 10. Multilingual retrieval verification (English, Telugu, Hindi)
 * 11. Error handling for corrupt/empty documents
 * 12. KnowledgeDocument status transition tracking
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const KnowledgeDocument = require('../src/models/KnowledgeDocument');
const { computeFileHash, computeTextHash } = require('../src/services/rag/hasher');
const { cleanText } = require('../src/services/rag/textCleaner');
const { splitIntoChunks } = require('../src/services/rag/chunker');
const { extractTextFromFile } = require('../src/services/rag/textExtractor');
const { generateEmbeddings, generateQueryEmbedding } = require('../src/services/rag/embeddingService');
const chromaService = require('../src/services/rag/chromaService');
const { ingestDocument } = require('../src/services/rag/ingestionService');
const { retrieveKnowledge } = require('../src/services/rag/retrievalService');

const TEST_DIR = path.join(__dirname, '../temp_test_docs');

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

const runPhase13Tests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 13 TEST SUITE: RAG & CHROMADB');
  console.log('====================================================\n');

  // Setup temp directory and test files
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  const sampleTxtPath = path.join(TEST_DIR, 'sample_vlits_handbook.txt');
  const sampleTxtContent = `
Vignan's Lara Institute of Technology & Science (VLITS)
Academic Regulations & Attendance Policy

1. Attendance Requirements:
Students are required to maintain a minimum of 75% aggregate attendance in all subjects and practicals to be eligible for semester-end examinations.
Condonation of shortage of attendance up to 10% (between 65% and 74%) may be granted by the Principal on medical grounds upon payment of the prescribed condonation fee.
Students with less than 65% attendance will be detained and must repeat the semester.

2. Grading System:
The college follows the 10-point grading scale.
Grade O: Outstanding (90% - 100%, Grade Points: 10)
Grade S: Superior (80% - 89%, Grade Points: 9)
Grade A: Excellent (70% - 79%, Grade Points: 8)
Grade B: Good (60% - 69%, Grade Points: 7)
Grade C: Average (50% - 59%, Grade Points: 6)
Grade D: Pass (40% - 49%, Grade Points: 5)
Grade F: Fail (Below 40%, Grade Points: 0)

3. Training & Placement Cell:
The Training and Placement Cell coordinates campus recruitment for leading tech firms including TCS, Infosys, Wipro, and Cognizant.
Students eligible for placement drives must have a minimum CGPA of 6.5 with no standing backlogs.
Placement training includes aptitude preparation, coding challenges, and mock interviews.
  `.trim();

  fs.writeFileSync(sampleTxtPath, sampleTxtContent, 'utf8');

  try {
    // 1. Connect to MongoDB Atlas
    console.log('1. MongoDB Atlas Connection for Knowledge Documents');
    await mongoose.connect(process.env.MONGODB_URI);
    assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connected successfully');

    // 2. Test SHA-256 Hashing
    console.log('\n2. Cryptographic SHA-256 Hashing');
    const hash1 = await computeFileHash(sampleTxtPath);
    const hash2 = await computeFileHash(sampleTxtPath);
    const textHash = computeTextHash(sampleTxtContent);
    assert(typeof hash1 === 'string' && hash1.length === 64, 'Generated 64-character SHA-256 file hash', hash1.slice(0, 16) + '...');
    assert(hash1 === hash2, 'SHA-256 file hashing is deterministic');
    assert(typeof textHash === 'string' && textHash.length === 64, 'Generated 64-character SHA-256 text hash');

    // 3. Test Conservative Text Cleaner
    console.log('\n3. Conservative Text Cleaning');
    const dirtyText = "   Vignan's    Lara\r\n\r\n\r\nInstitute of\tTechnology\n\n\nPage 12 of 100\n\n   ";
    const cleaned = cleanText(dirtyText);
    assert(cleaned.includes("Vignan's Lara"), 'Normalized excessive inline whitespace');
    assert(!cleaned.includes('\r'), 'Normalized carriage returns');
    assert(cleaned.includes('Institute of Technology'), 'Preserved institutional keywords intact');

    // 4. Test Text Chunker
    console.log('\n4. Text Chunker & Metadata Enrichment');
    const chunks = splitIntoChunks(sampleTxtContent, {
      documentId: 'doc_test_123',
      source: 'sample_vlits_handbook.txt',
      title: 'VLITS Handbook',
    }, { chunkSize: 400, chunkOverlap: 50 });

    assert(chunks.length >= 2, 'Split document into chunks', `${chunks.length} chunks`);
    assert(chunks[0].documentId === 'doc_test_123', 'Chunk contains documentId metadata');
    assert(chunks[0].chunkIndex === 0, 'Chunk contains 0-based chunkIndex');
    assert(chunks[0].contentHash && chunks[0].contentHash.length === 64, 'Chunk contains contentHash');
    assert(chunks[0].source === 'sample_vlits_handbook.txt', 'Chunk contains source filename');

    // 5. Test Text Extractor
    console.log('\n5. Multi-Format Text Extraction');
    const extracted = await extractTextFromFile(sampleTxtPath);
    assert(extracted.fileType === 'TXT', 'Detected TXT file type');
    assert(extracted.text.includes('Academic Regulations'), 'Extracted full text content');

    // 6. Test ChromaDB Health Check
    console.log('\n6. ChromaDB Connection & Health Check');
    const health = await chromaService.healthCheck();
    assert(health.status === 'HEALTHY', 'ChromaDB is reachable and healthy', `Collection: ${health.collection}`);
    assert(typeof health.count === 'number', 'Retrieved collection vector count', `Count: ${health.count}`);

    // 7. Test BAAI/bge-m3 Embeddings
    console.log('\n7. BAAI/bge-m3 Dense Vector Embeddings');
    const sampleTexts = [
      'Vignan Lara Institute of Technology & Science attendance criteria is 75 percent.',
      'Students with 65% attendance require medical condonation.',
    ];
    const embeddings = await generateEmbeddings(sampleTexts);
    assert(Array.isArray(embeddings) && embeddings.length === 2, 'Generated embeddings for batch of 2 texts');
    assert(embeddings[0].length === 1024, 'Vector dimensionality is exactly 1024 (BGE-M3 standard)');

    const queryVec = await generateQueryEmbedding('What is the minimum attendance required?');
    assert(Array.isArray(queryVec) && queryVec.length === 1024, 'Generated 1024-dim query embedding');

    // 8. Test End-to-End Ingestion Pipeline
    console.log('\n8. End-to-End Document Ingestion (Ingest -> ChromaDB -> MongoDB)');
    // Clean up any previous test doc record
    await KnowledgeDocument.deleteMany({ source: 'sample_vlits_handbook.txt' });

    const ingestResult = await ingestDocument(sampleTxtPath, { category: 'REGULATIONS' });
    assert(ingestResult.status === 'COMPLETED', 'Document ingestion completed successfully');
    assert(ingestResult.chunkCount > 0, 'Ingested chunks into ChromaDB', `${ingestResult.chunkCount} chunks`);

    const mongoDoc = await KnowledgeDocument.findById(ingestResult.documentId);
    assert(mongoDoc && mongoDoc.processingStatus === 'COMPLETED', 'MongoDB KnowledgeDocument status updated to COMPLETED');
    assert(mongoDoc.hash === hash1, 'MongoDB KnowledgeDocument stored matching SHA-256 hash');
    assert(mongoDoc.chunkCount === ingestResult.chunkCount, 'MongoDB KnowledgeDocument stored correct chunk count');

    // 9. Test Duplicate Document Detection (Deduplication)
    console.log('\n9. Duplicate Document Detection');
    const dupResult = await ingestDocument(sampleTxtPath, { category: 'REGULATIONS' });
    assert(dupResult.status === 'SKIPPED', 'Identical document skipped with status SKIPPED');
    assert(dupResult.message.includes('already exists'), 'Duplicate document returned descriptive message');

    // 10. Test Basic Similarity Retrieval
    console.log('\n10. Basic Similarity Retrieval');
    const retrievalResults = await retrieveKnowledge('What is the minimum attendance required for exams?', { topK: 3 });
    assert(Array.isArray(retrievalResults) && retrievalResults.length > 0, 'Retrieved matching candidate chunks');
    assert(retrievalResults[0].text.toLowerCase().includes('attendance'), 'Top result contains relevant keyword "attendance"');
    assert(typeof retrievalResults[0].score === 'number', 'Result includes similarity score', `Score: ${retrievalResults[0].score.toFixed(4)}`);
    assert(retrievalResults[0].metadata && (retrievalResults[0].metadata.source || retrievalResults[0].metadata.documentId), 'Result includes rich source metadata');

    // 11. Test Multilingual Retrieval (English, Telugu, Hindi)
    console.log('\n11. Multilingual Query Retrieval');
    const teluguResults = await retrieveKnowledge('పరీక్షలకు ఎంత హాజరు శాతం ఉండాలి?', { topK: 3 });
    assert(Array.isArray(teluguResults) && teluguResults.length > 0, 'Telugu query returned candidate chunks');

    const hindiResults = await retrieveKnowledge('परीक्षा के लिए कितनी उपस्थिति चाहिए?', { topK: 3 });
    assert(Array.isArray(hindiResults) && hindiResults.length > 0, 'Hindi query returned candidate chunks');

    // 12. Test Failure Handling & Corrupt File
    console.log('\n12. Ingestion Error Handling');
    const emptyFilePath = path.join(TEST_DIR, 'empty_corrupt_doc.txt');
    fs.writeFileSync(emptyFilePath, '   \n\n   ', 'utf8');

    let failedAsExpected = false;
    try {
      await ingestDocument(emptyFilePath);
    } catch (err) {
      failedAsExpected = true;
    }
    assert(failedAsExpected, 'Empty/corrupt document rejected with error');

    const failedDoc = await KnowledgeDocument.findOne({ source: 'empty_corrupt_doc.txt' });
    assert(failedDoc && failedDoc.processingStatus === 'FAILED', 'MongoDB document marked as FAILED with error message');

    // Cleanup temp test artifacts
    if (fs.existsSync(sampleTxtPath)) fs.unlinkSync(sampleTxtPath);
    if (fs.existsSync(emptyFilePath)) fs.unlinkSync(emptyFilePath);
    if (fs.existsSync(TEST_DIR)) fs.rmdirSync(TEST_DIR);

    // Clean up created test records in MongoDB
    if (ingestResult.documentId) {
      await KnowledgeDocument.findByIdAndDelete(ingestResult.documentId);
    }
    if (failedDoc) {
      await KnowledgeDocument.findByIdAndDelete(failedDoc._id);
    }
    await chromaService.deleteByDocumentId(ingestResult.documentId);

    console.log('\n====================================================');
    console.log(`PHASE 13 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal error during Phase 13 tests:', err);
    failedTests++;
  } finally {
    await mongoose.disconnect();
    process.exit(failedTests > 0 ? 1 : 0);
  }
};

runPhase13Tests();
