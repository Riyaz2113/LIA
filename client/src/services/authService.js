import apiClient from './apiClient';

// Mock student profile matching the approved reference design
const MOCK_STUDENT_USER = {
  id: 'mock-student-001',
  name: 'Rahul Kumar',
  email: 'rahulkumar21bcs101@vignan.ac.in',
  role: 'STUDENT',
  phone: '+91 98765 43210',
  isActive: true,
  profile: {
    rollNumber: '21BCS101',
    department: 'Computer Science and Engineering',
    year: 'III Year',
    section: 'Section A',
  },
};

/**
 * authService
 * Handles real backend API calls with seamless mock fallback for frontend testing.
 */
export const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      // If backend is offline or student demo credentials entered, allow mock student access
      const id = credentials.identifier?.toLowerCase() || '';
      if (
        id.includes('21bcs101') ||
        id.includes('student') ||
        id.includes('rahul') ||
        !err.response // Network error / backend offline
      ) {
        sessionStorage.setItem('lia_mock_user', JSON.stringify(MOCK_STUDENT_USER));
        return {
          success: true,
          message: 'Login successful (Demo Mode)',
          user: MOCK_STUDENT_USER,
        };
      }
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore network errors
    } finally {
      sessionStorage.removeItem('lia_mock_user');
    }
    return { success: true, message: 'Logged out' };
  },

  me: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (err) {
      const stored = sessionStorage.getItem('lia_mock_user');
      if (stored) {
        const user = JSON.parse(stored);
        return { success: true, user, profile: user.profile };
      }
      throw err;
    }
  },
};

