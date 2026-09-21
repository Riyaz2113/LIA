import { Outlet } from 'react-router-dom';

/**
 * FacultyLayout
 * Wraps all authenticated faculty portal pages.
 * Sidebar and top navbar will be added in the Faculty Portal phase.
 */
const FacultyLayout = () => {
  return (
    <div className="faculty-layout">
      {/* TODO: <FacultySidebar /> */}
      {/* TODO: <FacultyNavbar /> */}
      <main className="faculty-main">
        <Outlet />
      </main>
    </div>
  );
};

export default FacultyLayout;
