import apiClient from './apiClient';

export const markService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/marks', { params });
    return res.data;
  },
  getStudentMarks: async () => {
    const res = await apiClient.get('/marks/student');
    return res.data;
  },
  enterMarks: async (data) => {
    const res = await apiClient.post('/marks', data);
    return res.data;
  },
};

export default markService;
