import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleRoute
 * Wraps routes that require a specific set of roles.
 * Must be nested inside <ProtectedRoute> so authentication is already verified.
 *
 * Behaviour:
 *   - If user's role is NOT in `allowedRoles`: redirects to /unauthorized
 *   - Otherwise: renders the nested <Outlet />
 *
 * Usage in router:
 *   {
 *     element: <ProtectedRoute />,
 *     children: [
 *       {
 *         element: <RoleRoute allowedRoles={['ADMIN']} />,
 *         children: [
 *           { path: '/admin/dashboard', element: <AdminDashboard /> },
 *         ]
 *       }
 *     ]
 *   }
 *
 * NOTE: Dashboard pages are implemented in future phases.
 */
const RoleRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
