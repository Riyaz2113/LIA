import apiClient from './apiClient';

export const materialService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/materials', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/materials/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/materials', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/materials/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/materials/${id}`);
    return res.data;
  },
};

export default materialService;
