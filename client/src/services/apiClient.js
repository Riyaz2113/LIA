import axios from 'axios';

// ─── Base URL ─────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ─── Axios Instance ───────────────────────────────────────────────────────────
// withCredentials: true is required so the browser sends the HTTP-only
// authentication cookie (lia_token) with every cross-origin request.
// The JWT is managed server-side in a secure HTTP-only cookie — NOT in
// localStorage. This prevents XSS token theft.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send HTTP-only cookie on every request
  timeout: 10000,
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Centralised error handling.
// 401 will trigger AuthContext to clear user state (wired in a future phase).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired or invalid — AuthContext handles state cleanup
      // The HTTP-only cookie will be cleared by the backend /logout endpoint
      // Do NOT call window.location.href here — let AuthContext/router handle it
    }

    return Promise.reject(error);
  }
);

export default apiClient;
