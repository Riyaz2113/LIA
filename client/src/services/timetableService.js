import apiClient from './apiClient';

export const timetableService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/timetable', { params });
    return res.data;
  },
  getStudentSchedule: async () => {
    const res = await apiClient.get('/timetable/student');
    return res.data;
  },
  getFacultySchedule: async () => {
    const res = await apiClient.get('/timetable/faculty');
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/timetable', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/timetable/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/timetable/${id}`);
    return res.data;
  },
};

export default timetableService;
