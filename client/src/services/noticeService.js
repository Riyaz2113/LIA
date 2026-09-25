import apiClient from './apiClient';

export const noticeService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/notices', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/notices/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/notices', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/notices/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/notices/${id}`);
    return res.data;
  },
};

export default noticeService;
