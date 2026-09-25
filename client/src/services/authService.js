import apiClient from './apiClient';

/**
 * authService
 * Handles authenticated API calls using secure HTTP-only cookies (lia_token).
 * Never stores JWT in localStorage or sessionStorage.
 */
export const authService = {
  /**
   * Authenticate user against backend POST /api/auth/login
   * @param {{ identifier: string, password: string, role?: string }} credentials
   * @returns {Promise<{ success: boolean, message: string, user: Object }>}
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', {
      identifier: credentials.identifier,
      password: credentials.password,
    });
    return response.data;
  },

  /**
   * Terminate session via backend POST /api/auth/logout
   * Clears HTTP-only cookie
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch {
      return { success: true, message: 'Logged out' };
    }
  },

  /**
   * Get currently authenticated user and profile via GET /api/auth/me
   * @returns {Promise<{ success: boolean, user: Object, profile?: Object }>}
   */
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default authService;

