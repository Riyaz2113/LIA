import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, User, LogOut, Settings } from 'lucide-react';
import LiaLogo from '../public/LiaLogo';
import { useAuth } from '../../context/AuthContext';

/**
 * FacultyHeader
 * Top navigation header matching the approved Faculty Portal reference designs.
 * Contains LIA branding, search bar, notification bell badge, faculty profile identity (Dr. R. Mehta), and dropdown.
 */
const FacultyHeader = ({ onToggleMobile }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const facultyName = user?.name || 'Dr. R. Mehta';
  const facultyDept = user?.profile?.department || 'Faculty | CSE';

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
      className="faculty-header"
    >
      {/* Left: Hamburger (Mobile) + LIA Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleMobile}
          aria-label="Toggle navigation"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
          }}
          className="faculty-mobile-menu-btn"
        >
          <Menu size={20} color="#0f172a" />
        </button>

        <LiaLogo />
      </div>

      {/* Center/Right: Search Bar + Notifications + Faculty Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            width: '340px',
            display: 'none',
          }}
          className="faculty-search-container"
        >
          <Search
            size={16}
            color="#64748b"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, subjects, notices..."
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2.25rem',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              outline: 'none',
              color: '#0f172a',
            }}
          />
        </div>

        {/* Notification Bell Badge */}
        <Link
          to="/faculty/notifications"
          style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            textDecoration: 'none',
          }}
        >
          <Bell size={18} />
          {/* Badge count 3 */}
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.625rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff',
            }}
          >
            3
          </span>
        </Link>

        {/* Faculty Profile dropdown trigger */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '10px',
              transition: 'background-color 150ms ease',
            }}
            className="faculty-profile-trigger"
          >
            {/* Faculty Avatar Circle */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9375rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.25)',
                border: '2px solid #2563eb',
                overflow: 'hidden',
              }}
            >
              {/* Stylized Professor Avatar SVG */}
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" fill="#1e293b" />
                <circle cx="20" cy="15" r="7" fill="#f8fafc" />
                <path d="M10 34C10 26 14 24 20 24C26 24 30 26 30 34" fill="#3b82f6" />
                <path d="M15 15C15 15 17 17 20 17C23 17 25 15 25 15" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16.5" cy="14" r="1.5" fill="#0f172a" />
                <circle cx="23.5" cy="14" r="1.5" fill="#0f172a" />
                <rect x="14" y="12" width="5" height="3.5" rx="1" stroke="#0f172a" strokeWidth="1.2" fill="none" />
                <rect x="21" y="12" width="5" height="3.5" rx="1" stroke="#0f172a" strokeWidth="1.2" fill="none" />
                <line x1="19" y1="13.5" x2="21" y2="13.5" stroke="#0f172a" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Faculty Name & Department */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {facultyName}
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
                {facultyDept}
              </span>
            </div>

            <ChevronDown size={15} color="#64748b" />
          </div>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '190px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                padding: '0.375rem',
                zIndex: 50,
              }}
            >
              <Link
                to="/faculty/profile"
                onClick={() => setProfileDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#334155',
                  textDecoration: 'none',
                }}
                className="dropdown-link-item"
              >
                <User size={15} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/faculty/settings"
                onClick={() => setProfileDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#334155',
                  textDecoration: 'none',
                }}
                className="dropdown-link-item"
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>

              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.25rem 0' }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                className="dropdown-link-item"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .faculty-search-container {
            display: block !important;
          }
        }
        @media (max-width: 900px) {
          .faculty-mobile-menu-btn {
            display: flex !important;
          }
        }
        .dropdown-link-item:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </header>
  );
};

export default FacultyHeader;
