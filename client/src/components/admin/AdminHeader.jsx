import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, User, LogOut, Settings } from 'lucide-react';
import LiaLogo from '../public/LiaLogo';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminHeader
 * Top navigation header matching the approved Student/Faculty Portal reference designs.
 * Contains LIA branding, search bar, notification bell badge, admin identity, and dropdown.
 */
const AdminHeader = ({ onToggleMobile }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
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

  const adminName = user?.name || 'Admin';
  const roleName = user?.role || 'Administrator';

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
      className="admin-header"
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
          className="admin-mobile-menu-btn"
        >
          <Menu size={20} color="#0f172a" />
        </button>

        <LiaLogo />
      </div>

      {/* Right: Search Bar + Notifications + Admin Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            width: '320px',
            display: 'none',
          }}
          className="admin-search-container"
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
            placeholder="Search anything (users, notices, records...)"
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
          to="/admin/notifications"
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

        {/* Admin Profile dropdown trigger */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '10px',
              transition: 'background-color 150ms ease',
            }}
            className="admin-profile-trigger"
          >
            {/* Admin Avatar */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9375rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              }}
            >
              {adminName.charAt(0).toUpperCase()}
            </div>

            {/* Admin Name & Role */}
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {adminName}
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
                {roleName}
              </span>
            </div>

            <ChevronDown size={15} color="#64748b" />
          </div>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
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
                to="/admin/settings"
                onClick={() => setDropdownOpen(false)}
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
                <span>General Settings</span>
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
          .admin-search-container {
            display: block !important;
          }
        }
        @media (max-width: 900px) {
          .admin-mobile-menu-btn {
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

export default AdminHeader;
