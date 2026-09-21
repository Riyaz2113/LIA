import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import router from './routes/router';

/**
 * App — root component.
 * AuthProvider wraps RouterProvider so auth state is available
 * to all routes and components via useAuth().
 */
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
