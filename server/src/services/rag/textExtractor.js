/**
 * textExtractor.js
 * Multi-format document text extraction utility supporting PDF, DOCX, and TXT.
 */

const fs = require('fs');
const path = require('path');
const pdfParseModule = require('pdf-parse');
const mammoth = require('mammoth');
const ocrService = require('./ocrService');

/**
 * extractPdfText
 * Supports both functional API (v1) and PDFParse class instance API (v2).
 */
const extractPdfText = async (dataBuffer) => {
  if (typeof pdfParseModule === 'function') {
    const pdfData = await pdfParseModule(dataBuffer);
    return {
      text: pdfData.text || '',
      pageCount: pdfData.numpages || null,
    };
  }

  const PDFParseClass = pdfParseModule.PDFParse || pdfParseModule.default;
  if (PDFParseClass) {
    const parser = new PDFParseClass({ data: dataBuffer });
    const res = await parser.getText();
    return {
      text: res.text || '',
      pageCount: res.total || (res.pages ? res.pages.length : null),
    };
  }

  throw new Error('Unsupported pdf-parse module format');
};

/**
 * isScannedPdf
 * Determines whether extracted PDF text is insufficient (indicating a scanned/image-based PDF).
 *
 * @param {string} rawText - Extracted text
 * @param {number} [pageCount=1] - Number of pages
 * @returns {boolean} True if document appears to be scanned/image-only
 */
const isScannedPdf = (rawText, pageCount = 1) => {
  if (!rawText || typeof rawText !== 'string') return true;

  // Clean out standard page footer lines like "-- 1 of 5 --"
  const clean = rawText.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '').trim();
  const minCharsPerPage = Number(process.env.OCR_MIN_CHARS_PER_PAGE || 50);
  const pages = Math.max(1, pageCount || 1);

  return clean.length / pages < minCharsPerPage;
};

/**
 * extractTextFromFile
 * Extracts raw text and basic metadata from a file path.
 *
 * @param {string} filePath - Absolute filesystem path
 * @param {Object} [options]
 * @param {boolean} [options.disableOcr=false] - Force bypass of OCR fallback
 * @returns {Promise<{ text: string, fileType: string, pageCount: number|null, title: string, extractionMethod: string, isScanned: boolean }>}
 */
const extractTextFromFile = async (filePath, options = {}) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const filename = path.basename(filePath, ext);

  let rawText = '';
  let pageCount = null;
  let fileType = '';
  let extractionMethod = 'native';
  let isScanned = false;

  switch (ext) {
    case '.pdf': {
      fileType = 'PDF';
      const dataBuffer = await fs.promises.readFile(filePath);
      const pdfData = await extractPdfText(dataBuffer);
      rawText = pdfData.text || '';
      pageCount = pdfData.pageCount || 1;

      // 1. Detect if PDF has digital text or is scanned/image-only
      isScanned = isScannedPdf(rawText, pageCount);

      if (isScanned && !options.disableOcr && ocrService.isOcrAvailable()) {
        try {
          const ocrResult = await ocrService.performOcrOnPdf(dataBuffer);
          if (ocrResult.text && ocrResult.text.trim().length > 0) {
            rawText = ocrResult.text;
            pageCount = ocrResult.pageCount || pageCount;
            extractionMethod = 'ocr';
          } else {
            extractionMethod = 'pdf-text';
          }
        } catch (ocrErr) {
          console.warn(`[textExtractor] OCR fallback failed for "${path.basename(filePath)}":`, ocrErr.message);
          extractionMethod = 'pdf-text';
        }
      } else {
        extractionMethod = 'pdf-text';
      }
      break;
    }

    case '.docx': {
      fileType = 'DOCX';
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value || '';
      extractionMethod = 'docx-native';
      break;
    }

    case '.txt':
    case '.md':
    case '.csv': {
      fileType = ext.slice(1).toUpperCase();
      rawText = await fs.promises.readFile(filePath, 'utf8');
      extractionMethod = 'text-native';
      break;
    }

    default:
      throw new Error(`Unsupported document extension "${ext}". Supported formats: PDF, DOCX, TXT.`);
  }

  return {
    text: rawText,
    fileType,
    pageCount,
    title: filename.replace(/[_-]/g, ' '),
    extractionMethod,
    isScanned,
  };
};

module.exports = {
  extractTextFromFile,
  isScannedPdf,
};
