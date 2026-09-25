import apiClient from './apiClient';

export const libraryService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/library', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/library/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/library', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/library/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/library/${id}`);
    return res.data;
  },
};

export default libraryService;
