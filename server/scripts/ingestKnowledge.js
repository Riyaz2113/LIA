/**
 * ingestKnowledge.js
 * CLI command to ingest documents into the LIA RAG knowledge base.
 * Usage:
 *   npm run ingest:knowledge -- ./knowledge
 *   node scripts/ingestKnowledge.js ./path/to/docs
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { ingestDocument } = require('../src/services/rag/ingestionService');

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'];

const findFilesRecursively = (dirOrFile) => {
  const stat = fs.statSync(dirOrFile);
  if (stat.isFile()) {
    const ext = path.extname(dirOrFile).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext) ? [path.resolve(dirOrFile)] : [];
  }

  const results = [];
  const entries = fs.readdirSync(dirOrFile, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirOrFile, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        results.push(path.resolve(fullPath));
      }
    }
  }

  return results;
};

const run = async () => {
  const targetPath = process.argv[2] || './knowledge';

  console.log('====================================================');
  console.log('📚 LIA RAG KNOWLEDGE INGESTION PIPELINE');
  console.log(`Target: ${targetPath}`);
  console.log(`Embedding Model: ${process.env.RAG_EMBEDDING_MODEL || 'BAAI/bge-m3'}`);
  console.log(`ChromaDB Collection: ${process.env.CHROMA_COLLECTION || 'lia_knowledge'}`);
  console.log('====================================================\n');

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${targetPath}`);
    process.exit(1);
  }

  const files = findFilesRecursively(targetPath);
  if (files.length === 0) {
    console.log(`No supported files (${SUPPORTED_EXTENSIONS.join(', ')}) found in ${targetPath}`);
    process.exit(0);
  }

  console.log(`Found ${files.length} document(s) to process.\n`);

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let completed = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = path.basename(file);
      console.log(`[${i + 1}/${files.length}] Ingesting: ${filename}`);

      try {
        const result = await ingestDocument(file);
        if (result.status === 'SKIPPED') {
          console.log(`  ↪ ${result.message}`);
          console.log(`  MongoDB Status: SKIPPED (Hash: ${result.hash.slice(0, 12)}...)\n`);
          skipped++;
        } else {
          console.log(`  Hash: ${result.hash.slice(0, 16)}...`);
          console.log(`  Extracted: ${result.extractedChars} characters`);
          console.log(`  Chunks: ${result.chunkCount}`);
          console.log(`  Embeddings: PASS (BAAI/bge-m3)`);
          console.log(`  ChromaDB: ${result.chromaStatus}`);
          console.log(`  MongoDB: COMPLETED\n`);
          completed++;
        }
      } catch (err) {
        console.error(`  ❌ Failed to ingest ${filename}: ${err.message}\n`);
        failed++;
      }
    }

    console.log('====================================================');
    console.log(`INGESTION SUMMARY: ${completed} Ingested, ${skipped} Skipped, ${failed} Failed`);
    console.log('====================================================');
  } catch (err) {
    console.error('Database connection or execution error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
