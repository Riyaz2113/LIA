/**
 * rebuildBm25.js
 * CLI command to rebuild the BM25 sparse keyword index from knowledge documents.
 * Usage:
 *   npm run rebuild:bm25
 *   node scripts/rebuildBm25.js [dirPath]
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const KnowledgeDocument = require('../src/models/KnowledgeDocument');
const { extractTextFromFile } = require('../src/services/rag/textExtractor');
const { cleanText } = require('../src/services/rag/textCleaner');
const { splitIntoChunks } = require('../src/services/rag/chunker');
const bm25Service = require('../src/services/rag/bm25Service');

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'];

const findFilesRecursively = (dirOrFile) => {
  if (!fs.existsSync(dirOrFile)) return [];
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
  console.log('⚡ REBUILDING BM25 SPARSE KEYWORD INDEX');
  console.log(`Target: ${targetPath}`);
  console.log('====================================================\n');

  try {
    let allChunks = [];
    const files = findFilesRecursively(targetPath);

    if (files.length > 0) {
      console.log(`Found ${files.length} document(s) in "${targetPath}". Processing chunks...`);
      for (const file of files) {
        const filename = path.basename(file);
        try {
          const extracted = await extractTextFromFile(file);
          if (extracted.text && extracted.text.trim()) {
            const cleaned = cleanText(extracted.text);
            const chunks = splitIntoChunks(cleaned, {
              documentId: filename.replace(/\.[^/.]+$/, ''),
              source: filename,
              title: extracted.title || filename,
              pageNumber: extracted.pageCount,
            });
            allChunks.push(...chunks);
          }
        } catch (err) {
          console.warn(`  ⚠️ Could not parse ${filename}: ${err.message}`);
        }
      }
    }

    console.log(`Knowledge chunks found: ${allChunks.length}`);
    const result = await bm25Service.rebuild(allChunks);
    console.log(`BM25 indexed chunks: ${result.indexedChunks}`);
    console.log(`Status: PASS\n`);

    console.log('====================================================');
    console.log('BM25 INDEX REBUILD COMPLETE');
    console.log('====================================================');
  } catch (err) {
    console.error('Error rebuilding BM25 index:', err);
    process.exit(1);
  }
};

run();
