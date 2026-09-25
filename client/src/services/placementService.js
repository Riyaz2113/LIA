import apiClient from './apiClient';

export const placementService = {
  getAllDrives: async (params = {}) => {
    const res = await apiClient.get('/placements/drives', { params });
    return res.data;
  },
  getDriveById: async (id) => {
    const res = await apiClient.get(`/placements/drives/${id}`);
    return res.data;
  },
  createDrive: async (data) => {
    const res = await apiClient.post('/placements/drives', data);
    return res.data;
  },
  updateDrive: async (id, data) => {
    const res = await apiClient.put(`/placements/drives/${id}`, data);
    return res.data;
  },
  deleteDrive: async (id) => {
    const res = await apiClient.delete(`/placements/drives/${id}`);
    return res.data;
  },
  getAllCompanies: async () => {
    const res = await apiClient.get('/placements/companies');
    return res.data;
  },
};

export default placementService;
