import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  BookOpen,
  Layers,
  Calendar,
  CheckSquare,
  Award,
  Image,
  FileText,
  CalendarDays,
  Briefcase,
  BookMarked,
  Folder,
  Bot,
  Bell,
  Settings,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminSidebar
 * Left navigation sidebar matching the exact approved Student/Faculty Portal reference design.
 * Features Admin Portal badge, organized categorized navigation groups,
 * active royal blue highlighted states, Settings, Logout, and bottom LIA AI Assistant card.
 */
const AdminSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
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

  const navGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Users & Roles', path: '/admin/users', icon: Users },
        { name: 'Students', path: '/admin/students', icon: GraduationCap },
        { name: 'Faculty', path: '/admin/faculty', icon: UserCheck },
        { name: 'Departments', path: '/admin/departments', icon: Building2 },
      ],
    },
    {
      title: 'Academics',
      items: [
        { name: 'Programs & Courses', path: '/admin/academics', icon: BookOpen },
        { name: 'Subjects', path: '/admin/subjects', icon: Layers },
        { name: 'Timetable', path: '/admin/timetable', icon: Calendar },
        { name: 'Attendance', path: '/admin/attendance', icon: CheckSquare },
        { name: 'Exams & Results', path: '/admin/exams', icon: Award },
      ],
    },
    {
      title: 'Website & Content',
      items: [
        { name: 'Hero & Gallery', path: '/admin/gallery', icon: Image },
        { name: 'Notices', path: '/admin/notices', icon: FileText },
        { name: 'Events', path: '/admin/events', icon: CalendarDays },
        { name: 'Placements', path: '/admin/placements', icon: Briefcase },
        { name: 'Library', path: '/admin/library', icon: BookMarked },
        { name: 'Study Materials', path: '/admin/materials', icon: Folder },
        { name: 'Chatbot Content', path: '/admin/chatbot', icon: Bot },
      ],
    },
    {
      title: 'System & Admin',
      items: [
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'General Settings', path: '/admin/settings', icon: Settings },
        { name: 'Activity Logs', path: '/admin/audit-logs', icon: ShieldAlert },
      ],
    },
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
      className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* 1. Top Admin Portal Badge */}
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
            <ShieldCheck size={18} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontSize: '0.9375rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}
          >
            Admin Portal
          </span>
        </div>

        {/* 2. Scrollable Navigation List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
          }}
          className="admin-sidebar-scroll"
        >
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0 0.75rem 0.35rem',
                }}
              >
                {group.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {group.items.map((item) => {
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
                        padding: '0.55rem 0.75rem',
                        borderRadius: '10px',
                        fontSize: '0.8125rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#ffffff' : '#334155',
                        backgroundColor: isActive ? '#2563eb' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 150ms ease',
                        boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.28)' : 'none',
                      }}
                      className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon
                        size={17}
                        color={isActive ? '#ffffff' : '#64748b'}
                        strokeWidth={isActive ? 2.4 : 2}
                      />
                      <span
                        style={{
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Section: Settings, Logout, and LIA Help Card */}
      <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Settings & Logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavLink
            to="/admin/settings"
            onClick={onCloseMobile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#475569',
              textDecoration: 'none',
              transition: 'background-color 150ms ease',
            }}
            className="admin-nav-item"
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
              padding: '0.5rem 0.75rem',
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
            className="admin-logout-btn"
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
            padding: '0.875rem 1rem',
            textAlign: 'center',
          }}
        >
          {/* LIA Avatar */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              margin: '0 auto 0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Bot size={18} />
          </div>

          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
            Admin AI Co-Pilot
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.625rem' }}>
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
        .admin-nav-item:hover {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .admin-nav-item.active:hover {
          background-color: #1d4ed8 !important;
          color: #ffffff !important;
        }
        .admin-logout-btn:hover {
          background-color: #fef2f2 !important;
        }
        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            left: -280px;
            transition: left 200ms ease;
            box-shadow: 10px 0 25px rgba(0, 0, 0, 0.1);
          }
          .admin-sidebar.mobile-open {
            left: 0 !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
