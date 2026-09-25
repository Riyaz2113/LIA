/**
 * hasher.js
 * Cryptographic SHA-256 hashing utility for documents and text chunks.
 */

const crypto = require('crypto');
const fs = require('fs');

/**
 * computeFileHash
 * Computes SHA-256 hash of a file at the given filesystem path.
 * @param {string} filePath
 * @returns {Promise<string>} Hex-encoded SHA-256 hash
 */
const computeFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
};

/**
 * computeTextHash
 * Computes SHA-256 hash of a text string or Buffer.
 * @param {string|Buffer} content
 * @returns {string} Hex-encoded SHA-256 hash
 */
const computeTextHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

module.exports = {
  computeFileHash,
  computeTextHash,
};
