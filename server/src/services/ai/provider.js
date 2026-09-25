/**
 * provider.js
 * LLM Provider Abstraction Layer for LIA Assistant.
 * Routes requests to the configured AI engine (Gemini, OpenAI, etc.).
 */

const { generateGeminiResponse } = require('./geminiProvider');
const { LIA_SYSTEM_PROMPT } = require('./systemPrompt');

/**
 * generateAIResponse
 * Unified interface for generating assistant responses.
 *
 * @param {Object} params
 * @param {Array} params.messages - Multi-turn conversation messages
 * @param {String} [params.systemPrompt] - Custom or default system prompt
 * @param {Object} [params.user] - Safe authenticated user context (name, role)
 * @returns {Promise<{ text: string, provider: string, model: string }>}
 */
const generateAIResponse = async ({
  messages = [],
  systemPrompt = LIA_SYSTEM_PROMPT,
  user = null,
}) => {
  // Provider selector (defaults to Google Gemini)
  const activeProvider = process.env.AI_PROVIDER || 'gemini';

  switch (activeProvider.toLowerCase()) {
    case 'gemini':
    default:
      return generateGeminiResponse({ messages, systemPrompt, user });
  }
};

module.exports = {
  generateAIResponse,
  LIA_SYSTEM_PROMPT,
};
