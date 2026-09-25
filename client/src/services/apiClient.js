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
  timeout: 60000, // 60s timeout for RAG + Cross-Encoder + Gemini generation
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Centralised error handling.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
