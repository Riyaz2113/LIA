import apiClient from './apiClient';

export const attendanceService = {
  getOverview: async (params = {}) => {
    const res = await apiClient.get('/attendance/overview', { params });
    return res.data;
  },
  getStudentAttendance: async () => {
    const res = await apiClient.get('/attendance/student');
    return res.data;
  },
  markBatch: async (data) => {
    const res = await apiClient.post('/attendance/batch', data);
    return res.data;
  },
};

export default attendanceService;
