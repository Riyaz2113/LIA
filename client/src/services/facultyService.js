import apiClient from './apiClient';

export const facultyService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/faculty', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/faculty/${id}`);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/faculty/me');
    return res.data;
  },
  updateMe: async (data) => {
    const res = await apiClient.put('/faculty/me', data);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/faculty', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/faculty/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/faculty/${id}`);
    return res.data;
  },
};

export default facultyService;
