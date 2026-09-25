/**
 * ocrService.js
 * Optical Character Recognition (OCR) fallback service for scanned and image-only PDF documents.
 * Integrates Tesseract OCR with PDF rendering to extract text page-by-page.
 */

const fs = require('fs');
const pdfParseModule = require('pdf-parse');
const { createWorker } = require('tesseract.js');

/**
 * cleanOcrText
 * Cleans OCR artifacts without stripping crucial numbers, dates, references, or names.
 *
 * @param {string} text - Raw OCR text output
 * @returns {string} Cleaned OCR text
 */
const cleanOcrText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    // Replace non-printable ASCII control characters (except newline, tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace multiple carriage returns with standard newlines
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove standalone stray OCR noise characters on isolated lines
    .replace(/\n\s*[|~`^_%]{1,2}\s*\n/g, '\n')
    // Replace 3+ consecutive newlines with 2 newlines (preserve paragraphs)
    .replace(/\n{3,}/g, '\n\n')
    // Trim horizontal whitespace on each line
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
};

/**
 * isOcrAvailable
 * Checks if OCR functionality is enabled via environment configuration.
 *
 * @returns {boolean}
 */
const isOcrAvailable = () => {
  return process.env.OCR_ENABLED !== 'false';
};

/**
 * performOcrOnImageBuffer
 * Recognizes text from an image buffer using a Tesseract worker.
 *
 * @param {Buffer|Uint8Array} imageBuffer - PNG/JPEG image buffer
 * @param {Object} [options]
 * @param {string} [options.lang='eng'] - Language code
 * @returns {Promise<string>} Recognized and cleaned text
 */
const performOcrOnImageBuffer = async (imageBuffer, options = {}) => {
  const lang = options.lang || 'eng';
  const worker = await createWorker(lang);
  try {
    const { data } = await worker.recognize(imageBuffer);
    return cleanOcrText(data.text || '');
  } finally {
    await worker.terminate();
  }
};

/**
 * performOcrOnPdf
 * Renders scanned PDF pages to high-resolution images and extracts text per page.
 *
 * @param {string|Buffer} filePathOrBuffer - Absolute file path or Buffer of PDF
 * @param {Object} [options]
 * @param {string} [options.lang='eng'] - OCR language
 * @param {number} [options.scale=2.0] - High-resolution render scale
 * @returns {Promise<{ text: string, pageCount: number, pages: Array<{ pageNumber: number, text: string }>, extractionMethod: string }>}
 */
const performOcrOnPdf = async (filePathOrBuffer, options = {}) => {
  if (!isOcrAvailable()) {
    throw new Error('OCR is disabled (OCR_ENABLED=false). Cannot perform OCR on scanned PDF.');
  }

  let dataBuffer;
  if (Buffer.isBuffer(filePathOrBuffer)) {
    dataBuffer = filePathOrBuffer;
  } else if (typeof filePathOrBuffer === 'string') {
    if (!fs.existsSync(filePathOrBuffer)) {
      throw new Error(`PDF file not found for OCR: ${filePathOrBuffer}`);
    }
    dataBuffer = await fs.promises.readFile(filePathOrBuffer);
  } else {
    throw new Error('Invalid input to performOcrOnPdf: expected file path or Buffer.');
  }

  const PDFParseClass = pdfParseModule.PDFParse || pdfParseModule.default;
  if (!PDFParseClass) {
    throw new Error('PDFParse class unavailable in pdf-parse module.');
  }

  const parser = new PDFParseClass({ data: dataBuffer });
  const scale = Number(options.scale || 2.0);

  // Render pages as image buffers
  const screenshotResult = await parser.getScreenshot({
    imageBuffer: true,
    scale,
  });

  if (!screenshotResult || !Array.isArray(screenshotResult.pages) || screenshotResult.pages.length === 0) {
    throw new Error('Failed to render PDF pages as images for OCR processing.');
  }

  const lang = options.lang || 'eng';
  const worker = await createWorker(lang);

  const pageResults = [];
  const fullTextParts = [];

  try {
    for (const page of screenshotResult.pages) {
      const pageNum = page.pageNumber || (pageResults.length + 1);
      const { data } = await worker.recognize(page.data);
      const cleaned = cleanOcrText(data.text || '');

      pageResults.push({
        pageNumber: pageNum,
        text: cleaned,
      });

      if (cleaned.length > 0) {
        fullTextParts.push(`[Page ${pageNum}]\n${cleaned}`);
      }
    }
  } finally {
    await worker.terminate();
  }

  return {
    text: fullTextParts.join('\n\n'),
    pageCount: pageResults.length,
    pages: pageResults,
    extractionMethod: 'ocr',
  };
};

module.exports = {
  cleanOcrText,
  isOcrAvailable,
  performOcrOnImageBuffer,
  performOcrOnPdf,
};
