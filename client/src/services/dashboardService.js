import apiClient from './apiClient';

export const dashboardService = {
  getAdminStats: async () => {
    const res = await apiClient.get('/dashboard/admin');
    return res.data;
  },
  getStudentStats: async () => {
    const res = await apiClient.get('/dashboard/student');
    return res.data;
  },
  getFacultyStats: async () => {
    const res = await apiClient.get('/dashboard/faculty');
    return res.data;
  },
};

export default dashboardService;
