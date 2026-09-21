import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 *
 * Behaviour:
 *   - While isLoading: renders nothing (prevents flash of redirect before /me resolves)
 *   - Not authenticated: redirects to /login
 *   - Authenticated: renders the nested <Outlet />
 *
 * Usage in router:
 *   {
 *     element: <ProtectedRoute />,
 *     children: [
 *       { path: '/student/dashboard', element: <StudentDashboard /> },
 *     ]
 *   }
 *
 * NOTE: Login page and dashboard pages are implemented in future phases.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Do not redirect during the initial auth check — cookie verification is in flight
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
