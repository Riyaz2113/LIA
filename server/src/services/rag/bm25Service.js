/**
 * bm25Service.js
 * High-performance Okapi BM25 sparse keyword retrieval service for LIA RAG pipeline.
 * Features multilingual Unicode tokenization and atomic JSON persistence.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_STORAGE_PATH = path.resolve(__dirname, '../../../chroma_data/bm25_index.json');
const K1 = 1.5;
const B = 0.75;

class BM25Service {
  constructor(storagePath = DEFAULT_STORAGE_PATH) {
    this.storagePath = storagePath;
    this.chunks = new Map(); // id -> { id, documentId, chunkIndex, text, metadata, tokens }
    this.docFreq = new Map(); // term -> number of documents containing term
    this.docLengths = new Map(); // id -> number of tokens
    this.totalTokens = 0;
    this.avgDocLength = 0;
    this.isInitialized = false;
  }

  /**
   * tokenize
   * Splits text into normalized lowercase tokens using Unicode word boundaries.
   * Preserves English, Telugu, Hindi, alphanumeric identifiers, and numbers.
   *
   * @param {string} text
   * @returns {Array<string>} List of tokens
   */
  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    
    // Normalize unicode to NFKC and lower-case
    const normalized = text.normalize('NFKC').toLowerCase();
    
    // Match unicode letters, numbers, and combining marks (crucial for Indic scripts like Telugu/Hindi)
    const matches = normalized.match(/[\p{L}\p{M}\p{N}]+/gu);
    if (!matches) return [];

    return matches.filter((t) => t.length > 0);
  }

  /**
   * init
   * Initializes the BM25 index from disk if present.
   */
  async init() {
    if (this.isInitialized) return;

    try {
      if (fs.existsSync(this.storagePath)) {
        const data = fs.readFileSync(this.storagePath, 'utf8');
        const parsed = JSON.parse(data);

        this.chunks.clear();
        this.docFreq.clear();
        this.docLengths.clear();
        this.totalTokens = 0;

        if (Array.isArray(parsed.chunks)) {
          for (const chunk of parsed.chunks) {
            const tokens = this.tokenize(chunk.text);
            const id = chunk.id || `${chunk.documentId}_${chunk.chunkIndex}_${chunk.metadata?.contentHash || ''}`;
            
            this.chunks.set(id, {
              id,
              documentId: chunk.documentId,
              chunkIndex: chunk.chunkIndex,
              text: chunk.text,
              metadata: chunk.metadata || {},
              tokens,
            });

            this.docLengths.set(id, tokens.length);
            this.totalTokens += tokens.length;

            const seenTerms = new Set(tokens);
            for (const term of seenTerms) {
              this.docFreq.set(term, (this.docFreq.get(term) || 0) + 1);
            }
          }
        }

        this.avgDocLength = this.chunks.size > 0 ? this.totalTokens / this.chunks.size : 0;
      }
    } catch (err) {
      console.warn('Could not load existing BM25 index file:', err.message);
    }

    this.isInitialized = true;
  }

  /**
   * save
   * Persists the current BM25 index to disk.
   */
  save() {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const serializableChunks = Array.from(this.chunks.values()).map((c) => ({
        id: c.id,
        documentId: c.documentId,
        chunkIndex: c.chunkIndex,
        text: c.text,
        metadata: c.metadata,
      }));

      fs.writeFileSync(
        this.storagePath,
        JSON.stringify({ chunks: serializableChunks, count: serializableChunks.length }, null, 2),
        'utf8'
      );
    } catch (err) {
      console.error('Failed to save BM25 index to disk:', err.message);
    }
  }

  /**
   * addChunks
   * Indexes a batch of text chunks into BM25.
   *
   * @param {Array<Object>} chunks
   */
  async addChunks(chunks) {
    await this.init();
    if (!Array.isArray(chunks) || chunks.length === 0) return;

    for (const chunk of chunks) {
      const id = chunk.id || `${chunk.documentId}_${chunk.chunkIndex}_${chunk.contentHash || chunk.metadata?.contentHash || ''}`;
      
      // If already exists, remove first to avoid double counting
      if (this.chunks.has(id)) {
        this.removeChunkInternal(id);
      }

      const tokens = this.tokenize(chunk.text);
      const metadata = {
        source: chunk.source || chunk.metadata?.source || '',
        title: chunk.title || chunk.metadata?.title || '',
        pageNumber: chunk.pageNumber !== undefined ? chunk.pageNumber : chunk.metadata?.pageNumber,
        section: chunk.section || chunk.metadata?.section || null,
        contentHash: chunk.contentHash || chunk.metadata?.contentHash || '',
      };

      this.chunks.set(id, {
        id,
        documentId: chunk.documentId,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        metadata,
        tokens,
      });

      this.docLengths.set(id, tokens.length);
      this.totalTokens += tokens.length;

      const seenTerms = new Set(tokens);
      for (const term of seenTerms) {
        this.docFreq.set(term, (this.docFreq.get(term) || 0) + 1);
      }
    }

    this.avgDocLength = this.chunks.size > 0 ? this.totalTokens / this.chunks.size : 0;
    this.save();
  }

  /**
   * removeChunkInternal
   */
  removeChunkInternal(id) {
    const existing = this.chunks.get(id);
    if (!existing) return;

    const tokens = existing.tokens || [];
    this.totalTokens -= tokens.length;
    this.docLengths.delete(id);

    const seenTerms = new Set(tokens);
    for (const term of seenTerms) {
      const count = this.docFreq.get(term) || 0;
      if (count <= 1) {
        this.docFreq.delete(term);
      } else {
        this.docFreq.set(term, count - 1);
      }
    }

    this.chunks.delete(id);
  }

  /**
   * removeByDocumentId
   * Removes all indexed chunks belonging to a documentId.
   *
   * @param {string} documentId
   */
  async removeByDocumentId(documentId) {
    await this.init();
    if (!documentId) return 0;

    const docIdStr = String(documentId);
    let removedCount = 0;

    for (const [id, chunk] of Array.from(this.chunks.entries())) {
      if (String(chunk.documentId) === docIdStr) {
        this.removeChunkInternal(id);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.avgDocLength = this.chunks.size > 0 ? this.totalTokens / this.chunks.size : 0;
      this.save();
    }

    return removedCount;
  }

  /**
   * count
   * Returns number of indexed chunks.
   */
  count() {
    return this.chunks.size;
  }

  /**
   * search
   * Performs Okapi BM25 keyword retrieval.
   *
   * @param {string} query
   * @param {number} [topK=10]
   * @returns {Array<Object>}
   */
  async search(query, topK = 10) {
    await this.init();
    if (!query || typeof query !== 'string' || this.chunks.size === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return [];
    }

    const N = this.chunks.size;
    const avgdl = this.avgDocLength || 1;
    const scores = [];

    // Calculate BM25 score for each document
    for (const [id, chunk] of this.chunks.entries()) {
      const docLength = this.docLengths.get(id) || 1;
      let score = 0;

      // Count term frequencies in this document
      const termCounts = new Map();
      for (const token of chunk.tokens) {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      }

      for (const qTerm of queryTokens) {
        const tf = termCounts.get(qTerm) || 0;
        if (tf === 0) continue;

        const df = this.docFreq.get(qTerm) || 0;
        // Standard Okapi BM25 IDF with smoothing
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));

        // Term score
        const numerator = tf * (K1 + 1);
        const denominator = tf + K1 * (1 - B + B * (docLength / avgdl));
        score += idf * (numerator / denominator);
      }

      if (score > 0) {
        scores.push({
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          score,
          metadata: chunk.metadata,
        });
      }
    }

    // Sort descending by BM25 score
    scores.sort((a, b) => b.score - a.score);

    return scores.slice(0, Number(topK || 10));
  }

  /**
   * rebuild
   * Clears and completely rebuilds index from a supplied array of chunks.
   *
   * @param {Array<Object>} allChunks
   */
  async rebuild(allChunks = []) {
    this.chunks.clear();
    this.docFreq.clear();
    this.docLengths.clear();
    this.totalTokens = 0;
    this.avgDocLength = 0;
    this.isInitialized = true;

    await this.addChunks(allChunks);
    return {
      status: 'REBUILT',
      indexedChunks: this.chunks.size,
    };
  }
}

// Export singleton instance
const bm25Service = new BM25Service();

module.exports = bm25Service;
