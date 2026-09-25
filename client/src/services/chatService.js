import apiClient from './apiClient';

/**
 * chatService
 * Frontend service for multi-turn LIA AI conversations and message persistence.
 */
export const chatService = {
  createConversation: async (data = {}) => {
    const res = await apiClient.post('/chat/conversations', data);
    return res.data;
  },

  getConversations: async () => {
    const res = await apiClient.get('/chat/conversations');
    return res.data;
  },

  getConversationById: async (id) => {
    const res = await apiClient.get(`/chat/conversations/${id}`);
    return res.data;
  },

  sendMessage: async (conversationId, message) => {
    const res = await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
      message,
    });
    return res.data;
  },

  deleteConversation: async (id) => {
    const res = await apiClient.delete(`/chat/conversations/${id}`);
    return res.data;
  },
};

export default chatService;
