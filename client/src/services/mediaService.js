import apiClient from './apiClient';

export const mediaService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/media', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/media', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/media/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/media/${id}`);
    return res.data;
  },
};

export default mediaService;
