import apiClient from './apiClient';

/**
 * Health check — verifies the backend API is reachable.
 * GET /api/health
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
