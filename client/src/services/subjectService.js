import apiClient from './apiClient';

export const subjectService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/subjects', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/subjects/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/subjects', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/subjects/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/subjects/${id}`);
    return res.data;
  },
};

export default subjectService;
