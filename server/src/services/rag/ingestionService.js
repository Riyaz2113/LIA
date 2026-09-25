/**
 * ingestionService.js
 * End-to-end institutional knowledge ingestion pipeline for LIA RAG foundation.
 * Orchestrates: File -> Hash -> Duplicate Check -> Extract -> Clean -> Chunk -> Embed -> ChromaDB Upsert -> BM25 Index -> MongoDB Status
 */

const path = require('path');
const KnowledgeDocument = require('../../models/KnowledgeDocument');
const { computeFileHash } = require('./hasher');
const { extractTextFromFile } = require('./textExtractor');
const { cleanText } = require('./textCleaner');
const { splitIntoChunks } = require('./chunker');
const { generateEmbeddings } = require('./embeddingService');
const chromaService = require('./chromaService');
const bm25Service = require('./bm25Service');

/**
 * ingestDocument
 * Ingests a single document file into the RAG knowledge base (ChromaDB + BM25).
 *
 * @param {string} filePath - Absolute filesystem path to document
 * @param {Object} [options]
 * @param {string} [options.category='GENERAL'] - Academic, Exam, Placement, etc.
 * @param {string} [options.uploadedBy=null] - User ID if uploaded via UI
 * @param {boolean} [options.force=false] - Force re-ingestion even if hash matches
 * @param {number} [options.chunkSize] - Custom chunk size
 * @param {number} [options.chunkOverlap] - Custom chunk overlap
 * @returns {Promise<Object>} Ingestion outcome details
 */
const ingestDocument = async (filePath, options = {}) => {
  const filename = path.basename(filePath);
  const hash = await computeFileHash(filePath);

  // 1. Check for existing identical document in MongoDB Atlas (Duplicate Detection)
  let docRecord = await KnowledgeDocument.findOne({ hash });

  if (docRecord && (docRecord.processingStatus === 'COMPLETED' || docRecord.processingStatus === 'PROCESSED') && !options.force) {
    return {
      status: 'SKIPPED',
      message: `Document "${filename}" with identical SHA-256 hash already exists.`,
      documentId: docRecord._id,
      hash,
      chunkCount: docRecord.chunkCount,
    };
  }

  // If no record exists, create initial PENDING document record in MongoDB
  if (!docRecord) {
    docRecord = await KnowledgeDocument.create({
      title: filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      source: filename,
      hash,
      category: options.category || 'GENERAL',
      uploadedBy: options.uploadedBy || null,
      processingStatus: 'PROCESSING',
      embeddingModel: process.env.RAG_EMBEDDING_MODEL || 'BAAI/bge-m3',
      collectionName: process.env.CHROMA_COLLECTION || 'lia_knowledge',
    });
  } else {
    docRecord.processingStatus = 'PROCESSING';
    docRecord.errorMessage = null;
    await docRecord.save();
  }

  try {
    // 2. Extract Text
    const extracted = await extractTextFromFile(filePath);
    if (!extracted.text || extracted.text.trim() === '') {
      throw new Error(`Extracted text from "${filename}" is empty.`);
    }

    // 3. Clean Text
    const cleanedText = cleanText(extracted.text);

    // 4. Chunk Text with Metadata
    const chunks = splitIntoChunks(cleanedText, {
      documentId: docRecord._id.toString(),
      source: filename,
      title: docRecord.title || extracted.title,
      pageNumber: extracted.pageCount,
      extractionMethod: extracted.extractionMethod || 'native',
    }, {
      chunkSize: options.chunkSize,
      chunkOverlap: options.chunkOverlap,
    });

    if (chunks.length === 0) {
      throw new Error(`Document "${filename}" produced 0 valid text chunks.`);
    }

    // 5. Generate BAAI/bge-m3 Dense Embeddings
    const textsToEmbed = chunks.map((c) => c.text);
    const embeddings = await generateEmbeddings(textsToEmbed);

    if (embeddings.length !== chunks.length) {
      throw new Error(`Generated embeddings count (${embeddings.length}) does not match chunks count (${chunks.length}).`);
    }

    // 6. Upsert vectors into ChromaDB
    const chromaResult = await chromaService.upsertChunks(chunks, embeddings);

    // 7. Index chunks in BM25 Sparse Index
    await bm25Service.addChunks(chunks);

    // 8. Update MongoDB KnowledgeDocument status to COMPLETED
    docRecord.fileType = extracted.fileType;
    docRecord.extractionMethod = extracted.extractionMethod || 'native';
    docRecord.isScanned = !!extracted.isScanned;
    docRecord.chunkCount = chunks.length;
    docRecord.processingStatus = 'COMPLETED';
    docRecord.processedAt = new Date();
    docRecord.vectorIndex = process.env.CHROMA_COLLECTION || 'lia_knowledge';
    await docRecord.save();

    return {
      status: 'COMPLETED',
      documentId: docRecord._id,
      filename,
      hash,
      extractedChars: cleanedText.length,
      extractionMethod: extracted.extractionMethod || 'native',
      isScanned: !!extracted.isScanned,
      chunkCount: chunks.length,
      chromaStatus: chromaResult.status,
    };
  } catch (err) {
    docRecord.processingStatus = 'FAILED';
    docRecord.errorMessage = err.message;
    await docRecord.save();
    throw err;
  }
};

/**
 * deleteDocument
 * Completely removes document chunks from ChromaDB, BM25 Index, and MongoDB.
 *
 * @param {string} documentId
 * @returns {Promise<{ documentId: string, bm25Removed: number }>}
 */
const deleteDocument = async (documentId) => {
  const docIdStr = String(documentId);

  // 1. Delete from ChromaDB
  await chromaService.deleteByDocumentId(docIdStr);

  // 2. Delete from BM25 Index
  const bm25Removed = await bm25Service.removeByDocumentId(docIdStr);

  // 3. Delete from MongoDB Atlas
  await KnowledgeDocument.findByIdAndDelete(docIdStr);

  return {
    documentId: docIdStr,
    bm25Removed,
  };
};

module.exports = {
  ingestDocument,
  deleteDocument,
};
