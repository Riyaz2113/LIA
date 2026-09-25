/**
 * test.phase13.5.js
 * Comprehensive automated test suite for Phase 13.5: OCR Fallback for Scanned PDF Ingestion.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { extractTextFromFile, isScannedPdf } = require('../src/services/rag/textExtractor');
const ocrService = require('../src/services/rag/ocrService');
const { ingestDocument } = require('../src/services/rag/ingestionService');
const KnowledgeDocument = require('../src/models/KnowledgeDocument');
const chromaService = require('../src/services/rag/chromaService');
const bm25Service = require('../src/services/rag/bm25Service');

let passedTests = 0;
let failedTests = 0;

const assert = (condition, description, detail = '') => {
  if (condition) {
    console.log(`  ✅ PASS: ${description} ${detail ? `(${detail})` : ''}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${description} ${detail ? `(${detail})` : ''}`);
    failedTests++;
  }
};

const runPhase13_5Tests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING PHASE 13.5 TEST SUITE: OCR FALLBACK FOR SCANNED PDFS');
  console.log('====================================================\n');

  try {
    // 1. Database Connection
    console.log('1. Database Connection');
    await mongoose.connect(process.env.MONGODB_URI);
    assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connected');

    // 2. OCR Availability & Environment Settings
    console.log('\n2. OCR Engine Availability & Configuration');
    const ocrAvailable = ocrService.isOcrAvailable();
    assert(ocrAvailable === true, 'OCR is enabled in environment', `OCR_ENABLED: ${process.env.OCR_ENABLED || 'true'}`);

    // 3. Digital PDF Text Detection (Normal extraction without OCR)
    console.log('\n3. Digital PDF Detection (Normal Text Extraction)');
    const digitalPdfPath = path.resolve(__dirname, '../knowledge/IV TIME TABLE.pdf');
    assert(fs.existsSync(digitalPdfPath), 'Found digital test PDF: IV TIME TABLE.pdf');

    const digitalResult = await extractTextFromFile(digitalPdfPath);
    assert(digitalResult.extractionMethod === 'pdf-text', 'Digital PDF uses normal extraction', `Method: ${digitalResult.extractionMethod}`);
    assert(digitalResult.isScanned === false, 'Digital PDF marked as NOT scanned', `isScanned: ${digitalResult.isScanned}`);
    assert(digitalResult.text.length > 1000, 'Digital PDF extracted full character content', `Chars: ${digitalResult.text.length}`);

    // 4. Scanned PDF Detection
    console.log('\n4. Scanned PDF Detection');
    const scannedCircularPath = path.resolve(__dirname, '../knowledge/Holiday_Circular (03-09-2026).pdf');
    assert(fs.existsSync(scannedCircularPath), 'Found scanned test PDF: Holiday_Circular (03-09-2026).pdf');

    const isScannedDetected = isScannedPdf('-- 1 of 1 --', 1);
    assert(isScannedDetected === true, 'isScannedPdf correctly flags low-character PDF text as scanned');

    // 5. OCR Fallback on Scanned Single-Page PDF
    console.log('\n5. OCR Fallback on Scanned Single-Page Circular');
    const scannedResult = await extractTextFromFile(scannedCircularPath);
    assert(scannedResult.extractionMethod === 'ocr', 'Scanned PDF routed to OCR fallback', `Method: ${scannedResult.extractionMethod}`);
    assert(scannedResult.isScanned === true, 'Scanned PDF marked as scanned', `isScanned: ${scannedResult.isScanned}`);
    assert(scannedResult.pageCount === 1, 'Scanned PDF preserves page count', `Pages: ${scannedResult.pageCount}`);
    assert(
      scannedResult.text.includes('Krishna Janmashtami') || scannedResult.text.includes('Janmashtami') || scannedResult.text.includes('holiday'),
      'OCR extracted holiday occasion keyword'
    );
    assert(
      scannedResult.text.includes('03.09.2026') || scannedResult.text.includes('2026'),
      'OCR preserved circular date and year'
    );
    assert(
      scannedResult.text.includes('VIGNAN') || scannedResult.text.includes('LARA'),
      'OCR preserved institution name'
    );

    // 6. OCR on Multi-Page Scanned Document
    console.log('\n6. OCR on Multi-Page Scanned PDF');
    const multiPagePdfPath = path.resolve(__dirname, '../knowledge/IV Year Project Review Circular_260911_153758.pdf');
    assert(fs.existsSync(multiPagePdfPath), 'Found multi-page test PDF: IV Year Project Review Circular');

    const multiPageResult = await extractTextFromFile(multiPagePdfPath);
    assert(multiPageResult.extractionMethod === 'ocr', 'Multi-page scanned PDF uses OCR fallback');
    assert(multiPageResult.pageCount === 2, 'Multi-page scanned PDF preserves total page count', `Pages: ${multiPageResult.pageCount}`);
    assert(multiPageResult.text.includes('[Page 1]') && multiPageResult.text.includes('[Page 2]'), 'Multi-page OCR includes explicit page markers');
    assert(
      multiPageResult.text.includes('Project') || multiPageResult.text.includes('Review') || multiPageResult.text.includes('CIRCULAR'),
      'Multi-page OCR captures project review keywords'
    );

    // 7. OCR Disabled Behavior (Bypass OCR)
    console.log('\n7. OCR Disabled Behavior');
    const disabledOcrResult = await extractTextFromFile(scannedCircularPath, { disableOcr: true });
    assert(disabledOcrResult.extractionMethod === 'pdf-text', 'Bypassed OCR when disableOcr is true');

    // 8. Ingestion of Scanned Document into MongoDB Atlas, ChromaDB & BM25
    console.log('\n8. End-to-End Ingestion of Scanned Document');
    const ingestResult = await ingestDocument(scannedCircularPath, {
      category: 'CAMPUS',
      force: true,
    });

    assert(ingestResult.status === 'COMPLETED', 'Scanned document ingestion completed successfully');
    assert(ingestResult.extractionMethod === 'ocr', 'Ingestion record preserved extractionMethod="ocr"');
    assert(ingestResult.isScanned === true, 'Ingestion record preserved isScanned=true');
    assert(ingestResult.chunkCount > 0, 'Generated valid chunks from OCR text', `Chunks: ${ingestResult.chunkCount}`);

    // Verify MongoDB Atlas persistence
    const savedDoc = await KnowledgeDocument.findById(ingestResult.documentId);
    assert(savedDoc && savedDoc.processingStatus === 'COMPLETED', 'MongoDB KnowledgeDocument status is COMPLETED');
    assert(savedDoc.extractionMethod === 'ocr', 'MongoDB KnowledgeDocument recorded extractionMethod="ocr"');
    assert(savedDoc.isScanned === true, 'MongoDB KnowledgeDocument recorded isScanned=true');

    // Verify ChromaDB vector search retrieves OCR chunk
    const queryEmb = await require('../src/services/rag/embeddingService').generateQueryEmbedding('Krishna Janmashtami holiday date');
    const chromaResults = await chromaService.querySimilarity(queryEmb, 3);
    const matchedChunk = chromaResults.find((c) => c.text.toLowerCase().includes('janmashtami') || c.text.toLowerCase().includes('holiday'));
    assert(!!matchedChunk, 'ChromaDB vector search retrieved chunk from OCR-extracted document');

    // Verify BM25 keyword search retrieves OCR chunk
    const bm25Results = await bm25Service.search('Krishna Janmashtami', 3);
    const bm25Match = bm25Results.find((c) => c.text.toLowerCase().includes('janmashtami') || c.text.toLowerCase().includes('holiday'));
    assert(!!bm25Match, 'BM25 sparse search retrieved chunk from OCR-extracted document');

    // 9. Duplicate Document Detection on OCR-Ingested Document
    console.log('\n9. Duplicate SHA-256 Detection on OCR Ingested Document');
    const dupResult = await ingestDocument(scannedCircularPath, { category: 'CAMPUS' });
    assert(dupResult.status === 'SKIPPED', 'Re-ingesting identical scanned document returned SKIPPED');
    assert(dupResult.message.includes('already exists'), 'Duplicate document returned descriptive message');

    // 10. Clean up test record from database & indexes
    console.log('\n10. Cleanup Test Records');
    await KnowledgeDocument.findByIdAndDelete(ingestResult.documentId);
    await chromaService.deleteByDocumentId(ingestResult.documentId);
    await bm25Service.removeByDocumentId(ingestResult.documentId);
    console.log('  Cleaned up temporary test document from Atlas, ChromaDB, and BM25.');

    console.log('\n====================================================');
    console.log(`PHASE 13.5 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal error during Phase 13.5 tests:', err);
    failedTests++;
  } finally {
    await mongoose.disconnect();
    process.exit(failedTests > 0 ? 1 : 0);
  }
};

runPhase13_5Tests();
