import apiClient from './apiClient';

export const studentService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/students', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/students/${id}`);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/students/me');
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/students', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/students/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/students/${id}`);
    return res.data;
  },
};

export default studentService;
