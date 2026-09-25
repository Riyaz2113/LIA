import apiClient from './apiClient';

export const auditLogService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/audit-logs', { params });
    return res.data;
  },
};

export default auditLogService;
