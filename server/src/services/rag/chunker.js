/**
 * chunker.js
 * Intelligent semantic and recursive text chunking with rich institutional metadata.
 */

const { computeTextHash } = require('./hasher');

/**
 * splitIntoChunks
 * Splits cleaned text into overlapping segments with rich metadata.
 *
 * @param {string} text - Cleaned document text
 * @param {Object} metadata - Metadata to attach to each chunk
 * @param {string} [metadata.documentId]
 * @param {string} [metadata.source]
 * @param {string} [metadata.title]
 * @param {number} [metadata.pageNumber]
 * @param {string} [metadata.section]
 * @param {Object} [options]
 * @param {number} [options.chunkSize=800] - Target characters per chunk
 * @param {number} [options.chunkOverlap=100] - Overlap characters between adjacent chunks
 * @returns {Array<Object>} List of structured chunks with metadata
 */
const splitIntoChunks = (text, metadata = {}, options = {}) => {
  const chunkSize = Number(options.chunkSize || process.env.RAG_CHUNK_SIZE || 800);
  const chunkOverlap = Number(options.chunkOverlap || process.env.RAG_CHUNK_OVERLAP || 100);

  if (!text || text.trim() === '') {
    return [];
  }

  const clean = text.trim();
  const chunks = [];

  // Paragraph splitting strategy first
  const paragraphs = clean.split(/\n\n+/);
  let currentChunk = '';
  let chunkIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();
    if (!para) continue;

    // If adding this paragraph fits comfortably in the chunk
    if ((currentChunk + '\n\n' + para).trim().length <= chunkSize) {
      currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
    } else {
      // If current chunk has content, finalize it
      if (currentChunk.trim().length > 0) {
        const chunkText = currentChunk.trim();
        chunks.push({
          documentId: metadata.documentId || null,
          chunkIndex,
          text: chunkText,
          charCount: chunkText.length,
          source: metadata.source || '',
          title: metadata.title || '',
          pageNumber: metadata.pageNumber || null,
          section: metadata.section || null,
          contentHash: computeTextHash(chunkText),
          createdAt: new Date(),
        });
        chunkIndex++;

        // Carry forward overlap from the tail of current chunk
        const overlapSlice = currentChunk.slice(-chunkOverlap);
        currentChunk = overlapSlice ? `${overlapSlice}\n\n${para}` : para;
      } else {
        currentChunk = para;
      }

      // If a single paragraph is larger than chunkSize, break it by sentences or characters
      while (currentChunk.length > chunkSize) {
        let splitIdx = currentChunk.lastIndexOf('. ', chunkSize);
        if (splitIdx === -1 || splitIdx < chunkSize / 2) {
          splitIdx = currentChunk.lastIndexOf(' ', chunkSize);
        }
        if (splitIdx === -1) {
          splitIdx = chunkSize;
        }

        const subText = currentChunk.slice(0, splitIdx + 1).trim();
        if (subText.length > 0) {
          chunks.push({
            documentId: metadata.documentId || null,
            chunkIndex,
            text: subText,
            charCount: subText.length,
            source: metadata.source || '',
            title: metadata.title || '',
            pageNumber: metadata.pageNumber || null,
            section: metadata.section || null,
            contentHash: computeTextHash(subText),
            createdAt: new Date(),
          });
          chunkIndex++;
        }

        const nextStart = Math.max(0, splitIdx + 1 - chunkOverlap);
        currentChunk = currentChunk.slice(nextStart).trim();
      }
    }
  }

  // Add any trailing chunk
  if (currentChunk.trim().length > 0) {
    const chunkText = currentChunk.trim();
    chunks.push({
      documentId: metadata.documentId || null,
      chunkIndex,
      text: chunkText,
      charCount: chunkText.length,
      source: metadata.source || '',
      title: metadata.title || '',
      pageNumber: metadata.pageNumber || null,
      section: metadata.section || null,
      contentHash: computeTextHash(chunkText),
      createdAt: new Date(),
    });
  }

  return chunks;
};

module.exports = {
  splitIntoChunks,
};
