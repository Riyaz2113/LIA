import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import LiaLogo from './LiaLogo';

/**
 * Header
 * Fixed navigation bar anchored securely at the top of the viewport.
 * Does not move, jump, or shift during scrolling.
 */
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const location = useLocation();

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Academics', id: 'academics' },
    { name: 'Campus Life', id: 'campus-life' },
    { name: 'Features', id: 'features' },
    { name: 'Contact', id: 'contact' },
  ];

  // Accurate active section detector based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is scrolled near bottom of page -> highlight Contact
      const isBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isBottom) {
        setActiveSection('Contact');
        return;
      }

      // Check each section in reverse document order
      const sectionsInOrder = [
        { name: 'Contact', id: 'contact' },
        { name: 'Campus Life', id: 'campus-life' },
        { name: 'Academics', id: 'academics' },
        { name: 'Features', id: 'features' },
        { name: 'About', id: 'about' },
        { name: 'Home', id: 'home' },
      ];

      const scrollPos = window.scrollY + 140;

      for (const sec of sectionsInOrder) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sec.name);
            return;
          }
        }
      }

      setActiveSection('Home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setActiveSection(link.name);
    setMobileMenuOpen(false);

    const targetElem = document.getElementById(link.id);
    if (targetElem) {
      const headerOffset = 68;
      const elementPosition = targetElem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${link.id}`);
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '68px',
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div className="container" style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            gap: '1rem',
          }}
        >
          {/* Left Brand Identity */}
          <LiaLogo />

          {/* Desktop Navigation Links (Center) */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="desktop-nav-menu"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2563eb' : '#334155',
                    padding: '0.375rem 0.25rem',
                    position: 'relative',
                    transition: 'color 150ms ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#334155';
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: 0,
                        right: 0,
                        height: '2.5px',
                        backgroundColor: '#2563eb',
                        borderRadius: '9999px',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Login Pill Button (Dark Navy) */}
            <Link
              to="/login"
              style={{
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                backgroundColor: '#0b1a38',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(11, 26, 56, 0.2)',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#162a56';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0b1a38';
              }}
            >
              <User size={15} strokeWidth={2.4} />
              <span>Login</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
              }}
              className="mobile-toggle-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            padding: '1rem 1.25rem 1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2563eb' : '#334155',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-menu {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
