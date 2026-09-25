import apiClient from './apiClient';

export const notificationService = {
  getMyNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },
  getAll: async () => {
    const res = await apiClient.get('/notifications/all');
    return res.data;
  },
  markAsRead: async (id) => {
    const res = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },
  broadcast: async (data) => {
    const res = await apiClient.post('/notifications/broadcast', data);
    return res.data;
  },
};

export default notificationService;
