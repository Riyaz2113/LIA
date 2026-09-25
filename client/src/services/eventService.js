import apiClient from './apiClient';

export const eventService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/events', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/events/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/events', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/events/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  },
};

export default eventService;
