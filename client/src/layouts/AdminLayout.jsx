import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

/**
 * AdminLayout
 * Primary layout wrapper for all authenticated Admin Portal pages.
 * Integrates the fixed AdminHeader, Dark Navy AdminSidebar, and responsive content area.
 */
const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
      className="lia-admin-layout"
    >
      {/* 1. Left Sidebar */}
      <AdminSidebar
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
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
        <AdminHeader onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem 3rem',
          }}
          className="admin-main-content-area"
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-main-content-area {
            padding: 1.25rem 1rem 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
