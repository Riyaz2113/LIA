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

// Faculty pages (Phase 8)
import FacultyDashboardPage from '../pages/faculty/FacultyDashboardPage';
import FacultyProfilePage from '../pages/faculty/FacultyProfilePage';
import FacultyClassesPage from '../pages/faculty/FacultyClassesPage';
import FacultyAttendancePage from '../pages/faculty/FacultyAttendancePage';
import FacultySubmissionsPage from '../pages/faculty/FacultySubmissionsPage';
import FacultyMarksPage from '../pages/faculty/FacultyMarksPage';
import FacultyMaterialsPage from '../pages/faculty/FacultyMaterialsPage';
import FacultyTimetablePage from '../pages/faculty/FacultyTimetablePage';
import FacultyAnnouncementsPage from '../pages/faculty/FacultyAnnouncementsPage';
import FacultyNotificationsPage from '../pages/faculty/FacultyNotificationsPage';
import FacultySettingsPage from '../pages/faculty/FacultySettingsPage';

// Admin pages (Phase 9)
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage';
import AdminFacultyPage from '../pages/admin/AdminFacultyPage';
import AdminDepartmentsPage from '../pages/admin/AdminDepartmentsPage';
import AdminAcademicsPage from '../pages/admin/AdminAcademicsPage';
import AdminSubjectsPage from '../pages/admin/AdminSubjectsPage';
import AdminTimetablePage from '../pages/admin/AdminTimetablePage';
import AdminAttendancePage from '../pages/admin/AdminAttendancePage';
import AdminExamsPage from '../pages/admin/AdminExamsPage';
import AdminNoticesPage from '../pages/admin/AdminNoticesPage';
import AdminEventsPage from '../pages/admin/AdminEventsPage';
import AdminPlacementsPage from '../pages/admin/AdminPlacementsPage';
import AdminLibraryPage from '../pages/admin/AdminLibraryPage';
import AdminMaterialsPage from '../pages/admin/AdminMaterialsPage';
import AdminGalleryPage from '../pages/admin/AdminGalleryPage';
import AdminChatbotPage from '../pages/admin/AdminChatbotPage';
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage';

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
              { index: true, element: <FacultyDashboardPage /> },
              { path: 'profile', element: <FacultyProfilePage /> },
              { path: 'classes', element: <FacultyClassesPage /> },
              { path: 'attendance', element: <FacultyAttendancePage /> },
              { path: 'submissions', element: <FacultySubmissionsPage /> },
              { path: 'marks', element: <FacultyMarksPage /> },
              { path: 'materials', element: <FacultyMaterialsPage /> },
              { path: 'timetable', element: <FacultyTimetablePage /> },
              { path: 'announcements', element: <FacultyAnnouncementsPage /> },
              { path: 'notifications', element: <FacultyNotificationsPage /> },
              { path: 'settings', element: <FacultySettingsPage /> },
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
              { index: true, element: <AdminDashboardPage /> },
              { path: 'users', element: <AdminUsersPage /> },
              { path: 'students', element: <AdminStudentsPage /> },
              { path: 'faculty', element: <AdminFacultyPage /> },
              { path: 'departments', element: <AdminDepartmentsPage /> },
              { path: 'academics', element: <AdminAcademicsPage /> },
              { path: 'subjects', element: <AdminSubjectsPage /> },
              { path: 'timetable', element: <AdminTimetablePage /> },
              { path: 'attendance', element: <AdminAttendancePage /> },
              { path: 'exams', element: <AdminExamsPage /> },
              { path: 'notices', element: <AdminNoticesPage /> },
              { path: 'events', element: <AdminEventsPage /> },
              { path: 'placements', element: <AdminPlacementsPage /> },
              { path: 'library', element: <AdminLibraryPage /> },
              { path: 'materials', element: <AdminMaterialsPage /> },
              { path: 'gallery', element: <AdminGalleryPage /> },
              { path: 'chatbot', element: <AdminChatbotPage /> },
              { path: 'notifications', element: <AdminNotificationsPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
              { path: 'audit-logs', element: <AdminAuditLogsPage /> },
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
