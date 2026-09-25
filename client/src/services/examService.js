import apiClient from './apiClient';

export const examService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/exams', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/exams/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/exams', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/exams/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/exams/${id}`);
    return res.data;
  },
};

export default examService;
