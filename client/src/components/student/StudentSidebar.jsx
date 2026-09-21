import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CheckSquare,
  Calendar,
  FileText,
  Briefcase,
  Bell,
  CalendarDays,
  BookOpen,
  Bot,
  Settings,
  LogOut,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * StudentSidebar
 * Left navigation sidebar matching the exact approved Student Portal reference design.
 * Features Student Portal badge, 9 active navigation items, Ask LIA (/chat), Settings, Logout,
 * and bottom LIA AI Assistant Help card.
 */
const StudentSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard, exact: true },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Attendance', path: '/student/attendance', icon: CheckSquare },
    { name: 'Subjects & Timetable', path: '/student/subjects', icon: Calendar },
    { name: 'Exams & Results', path: '/student/exams', icon: FileText },
    { name: 'Placements', path: '/student/placements', icon: Briefcase },
    { name: 'Notices', path: '/student/notices', icon: Bell },
    { name: 'Events', path: '/student/events', icon: CalendarDays },
    { name: 'Library Resources', path: '/student/library', icon: BookOpen },
    { name: 'Ask LIA', path: '/chat', icon: Bot, isChat: true },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '100vh',
        padding: '1.25rem 1rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
      className={`student-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
    >
      <div>
        {/* Top Student Portal Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.625rem 0.875rem',
            marginBottom: '1.25rem',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserCheck size={18} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontSize: '0.9375rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}
          >
            Student Portal
          </span>
        </div>

        {/* Primary Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : '#334155',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.28)' : 'none',
                }}
                className={`student-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.4 : 2}
                  color={isActive ? '#ffffff' : '#64748b'}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings, Logout, and LIA Help Card */}
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Settings & Logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavLink
            to="/student/profile"
            onClick={onCloseMobile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#475569',
              textDecoration: 'none',
              transition: 'background-color 150ms ease',
            }}
            className="student-nav-link"
          >
            <Settings size={18} color="#64748b" />
            <span>Settings</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#dc2626',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'background-color 150ms ease',
            }}
          >
            <LogOut size={18} color="#dc2626" />
            <span>Logout</span>
          </button>
        </div>

        {/* LIA Assistant Help Card */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1.5px solid #dbeafe',
            borderRadius: '14px',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          {/* LIA Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              margin: '0 auto 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Bot size={20} />
          </div>

          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
            Need Help?
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Ask LIA anytime!
          </div>

          <NavLink
            to="/chat"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.45rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            }}
          >
            <span>Chat with LIA</span>
            <ArrowRight size={12} strokeWidth={2.5} />
          </NavLink>
        </div>
      </div>

      <style>{`
        .student-nav-link:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .student-nav-link.active:hover {
          background-color: #1d4ed8 !important;
          color: #ffffff !important;
        }
        @media (max-width: 900px) {
          .student-sidebar {
            position: fixed !important;
            left: -280px;
            transition: left 200ms ease;
            box-shadow: 10px 0 25px rgba(0, 0, 0, 0.1);
          }
          .student-sidebar.mobile-open {
            left: 0 !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default StudentSidebar;
