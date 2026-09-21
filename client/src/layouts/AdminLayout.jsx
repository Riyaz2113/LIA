import { Outlet } from 'react-router-dom';

/**
 * AdminLayout
 * Wraps all authenticated admin portal pages.
 * Sidebar and top navbar will be added in the Admin Portal phase.
 */
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* TODO: <AdminSidebar /> */}
      {/* TODO: <AdminNavbar /> */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
