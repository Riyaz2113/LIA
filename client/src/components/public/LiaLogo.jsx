import { Link } from 'react-router-dom';

/**
 * LiaLogo
 * Branded logo component matching the exact header and login reference screenshots.
 * Displays the graduation cap icon, LIA name, vertical divider, and college identity.
 */
const LiaLogo = ({ light = false, showCollege = true }) => {
  return (
    <Link
      to="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.875rem',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      {/* Brand Icon: Stylized Graduation Cap in Blue / Navy */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: light
            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
            : 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(29, 78, 216, 0.25)',
          flexShrink: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L2 8L12 13L22 8L12 3Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10.5V16C6 17.6569 8.68629 19 12 19C15.3137 19 18 17.6569 18 16V10.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 8V14"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="13" r="1.2" fill="#ffffff" />
        </svg>
      </div>

      {/* LIA Brand Text */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: '1.375rem',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: light ? '#60a5fa' : '#1d4ed8',
          }}
        >
          LIA
        </span>
        <span
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            color: light ? '#94a3b8' : '#475569',
            letterSpacing: '0.02em',
            marginTop: '2px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
        >
          Lara Intelligent Assistant
        </span>
      </div>

      {/* Vertical Divider & College Name (matching reference) */}
      {showCollege && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            paddingLeft: '0.875rem',
            borderLeft: `1.5px solid ${light ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}`,
            marginLeft: '0.25rem',
          }}
          className="lia-college-brand-block"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: light ? '#ffffff' : '#0f172a',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
              }}
            >
              Vignan&apos;s Lara Institute <br className="college-break" /> of Technology &amp; Science
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: light ? '#94a3b8' : '#64748b',
                fontWeight: 600,
                marginTop: '1px',
                letterSpacing: '0.02em',
              }}
            >
              Learn &bull; Innovate &bull; Grow
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default LiaLogo;
