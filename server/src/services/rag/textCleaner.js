/**
 * textCleaner.js
 * Conservative text cleaning for institutional documents.
 * Preserves factual accuracy, numbers, bullet lists, and multilingual characters.
 */

/**
 * cleanText
 * Sanitizes raw extracted text without altering factual meaning.
 * @param {string} rawText
 * @returns {string} Cleaned text
 */
const cleanText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Normalize unicode characters & carriage returns
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Remove common PDF header/footer page number artifacts safely
  text = text.replace(/^[ \t]*(?:Page \d+(?: of \d+)?|-+ \d+ -+|\d+\s*\/\s*\d+)[ \t]*$/gim, '');

  // 3. Replace non-breaking spaces and tabs with standard single spaces
  text = text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
  text = text.replace(/\t+/g, ' ');

  // 4. Collapse multiple inline spaces into a single space (while keeping newlines)
  text = text.replace(/[ ]{2,}/g, ' ');

  // 5. Trim lines
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  // 6. Collapse 3+ consecutive newlines to maximum 2 newlines (preserve paragraph boundaries)
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
};

module.exports = {
  cleanText,
};
