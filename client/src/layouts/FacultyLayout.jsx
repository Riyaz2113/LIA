import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FacultySidebar from '../components/faculty/FacultySidebar';
import FacultyHeader from '../components/faculty/FacultyHeader';

/**
 * FacultyLayout
 * Primary layout wrapper for all authenticated Faculty Portal pages.
 * Integrates the fixed FacultyHeader, full-height FacultySidebar, and responsive content canvas.
 */
const FacultyLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
      className="lia-faculty-layout"
    >
      {/* 1. Left Sidebar */}
      <FacultySidebar
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
        <FacultyHeader onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem 3rem',
          }}
          className="faculty-main-content-area"
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .faculty-main-content-area {
            padding: 1.25rem 1rem 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FacultyLayout;
