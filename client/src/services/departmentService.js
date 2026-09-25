import apiClient from './apiClient';

export const departmentService = {
  getAll: async () => {
    const res = await apiClient.get('/departments');
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/departments/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/departments', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/departments/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/departments/${id}`);
    return res.data;
  },
};

export default departmentService;
