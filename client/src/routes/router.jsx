import { createBrowserRouter } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import FacultyLayout from '../layouts/FacultyLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import ChatPage from '../pages/chat/ChatPage';

import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import StudentAttendancePage from '../pages/student/StudentAttendancePage';
import StudentSubjectsPage from '../pages/student/StudentSubjectsPage';
import StudentExamsPage from '../pages/student/StudentExamsPage';
import StudentPlacementsPage from '../pages/student/StudentPlacementsPage';
import StudentNoticesPage from '../pages/student/StudentNoticesPage';
import StudentEventsPage from '../pages/student/StudentEventsPage';
import StudentLibraryPage from '../pages/student/StudentLibraryPage';

// Utility pages
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Application router
 *
 * Structure:
 *   /                → Public pages (PublicLayout) — no auth required
 *   /student/*       → StudentLayout — requires auth + STUDENT role
 *   /faculty/*       → FacultyLayout — requires auth + FACULTY role
 *   /admin/*         → AdminLayout   — requires auth + ADMIN role
 *   *                → 404 Not Found
 *
 * Login page and dashboard pages are added in future phases.
 * ProtectedRoute and RoleRoute provide the authentication/authorization
 * layer without requiring any UI pages yet.
 */
const router = createBrowserRouter([
  {
    // ── Public Website ─────────────────────────────────────────
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      // Additional public pages added in the Public Website phase
    ],
  },

  {
    // ── Authentication ─────────────────────────────────────────
    path: '/login',
    element: <LoginPage />,
  },

  {
    // ── LIA Chat Interface (Phase 6) ───────────────────────────
    path: '/chat',
    element: <ChatPage />,
  },

  {
    // ── Student Portal ─────────────────────────────────────────
    // ProtectedRoute checks authentication (cookie/JWT).
    // RoleRoute checks that the user is a STUDENT.
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['STUDENT']} />,
        children: [
          {
            path: '/student',
            element: <StudentLayout />,
            children: [
              { index: true, element: <StudentDashboardPage /> },
              { path: 'profile', element: <StudentProfilePage /> },
              { path: 'attendance', element: <StudentAttendancePage /> },
              { path: 'subjects', element: <StudentSubjectsPage /> },
              { path: 'timetable', element: <StudentSubjectsPage /> },
              { path: 'exams', element: <StudentExamsPage /> },
              { path: 'results', element: <StudentExamsPage /> },
              { path: 'placements', element: <StudentPlacementsPage /> },
              { path: 'notices', element: <StudentNoticesPage /> },
              { path: 'events', element: <StudentEventsPage /> },
              { path: 'library', element: <StudentLibraryPage /> },
            ],
          },
        ],
      },
    ],
  },

  {
    // ── Faculty Portal ─────────────────────────────────────────
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['FACULTY']} />,
        children: [
          {
            path: '/faculty',
            element: <FacultyLayout />,
            children: [
              // Faculty dashboard pages added in the Faculty Portal phase
            ],
          },
        ],
      },
    ],
  },

  {
    // ── Admin Portal ───────────────────────────────────────────
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              // Admin dashboard pages added in the Admin Portal phase
            ],
          },
        ],
      },
    ],
  },

  {
    // ── 404 ────────────────────────────────────────────────────
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
