import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/student/StudentSidebar';
import StudentHeader from '../components/student/StudentHeader';

/**
 * StudentLayout
 * Primary layout wrapper for all authenticated Student Portal pages.
 * Integrates the fixed StudentHeader, full-height StudentSidebar, and responsive content canvas.
 */
const StudentLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
      className="lia-student-layout"
    >
      {/* 1. Left Sidebar */}
      <StudentSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Backdrop for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 35,
          }}
        />
      )}

      {/* 2. Main Content Canvas */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: '#f8fafc',
        }}
      >
        <StudentHeader onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem 3rem',
          }}
          className="student-main-content-area"
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .student-main-content-area {
            padding: 1.25rem 1rem 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentLayout;
