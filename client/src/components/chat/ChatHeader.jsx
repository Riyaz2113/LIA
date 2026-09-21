import { Minus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ChatHeader
 * Exact header matching both approved chat reference screens.
 * Deep royal blue gradient, LIA 3D robot avatar, LIA branding, vertical divider,
 * Vignan's Lara college title, and minimize/close controls.
 */
const ChatHeader = ({ onMinimize, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #092c74 0%, #0d419d 55%, #0a3382 100%)',
        color: '#ffffff',
        padding: '1.25rem 1.25rem 1.125rem',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(9, 44, 116, 0.25)',
      }}
      className="lia-chat-header"
    >
      {/* Left: Robot Mascot Avatar + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Robot Head Avatar */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <svg viewBox="0 0 100 100" width="36" height="36">
            <defs>
              <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="screenGradHead" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#081b3d" />
                <stop offset="100%" stopColor="#0f2b5c" />
              </linearGradient>
              <linearGradient id="blueEar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            {/* Earphones */}
            <circle cx="16" cy="50" r="10" fill="url(#blueEar)" />
            <circle cx="84" cy="50" r="10" fill="url(#blueEar)" />
            {/* Antenna */}
            <ellipse cx="50" cy="22" rx="10" ry="4" fill="url(#blueEar)" />
            <rect x="47" y="16" width="6" height="8" rx="3" fill="#38bdf8" />
            {/* Head */}
            <rect x="20" y="24" width="60" height="48" rx="18" fill="url(#headGrad)" />
            {/* Screen */}
            <rect x="26" y="30" width="48" height="36" rx="12" fill="url(#screenGradHead)" />
            {/* Cyan Eyes */}
            <path
              d="M 36 46 C 37 40, 43 40, 44 46"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 56 46 C 57 40, 63 40, 64 46"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Smile */}
            <path
              d="M 46 54 Q 50 58 54 54"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* LIA Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '0.02em',
              color: '#ffffff',
            }}
          >
            LIA
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              color: '#bfdbfe',
              fontWeight: 500,
              marginTop: '3px',
              whiteSpace: 'nowrap',
            }}
          >
            Lara Intelligent Assistant
          </div>
        </div>

        {/* Vertical Divider */}
        <div
          style={{
            width: '1px',
            height: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            marginInline: '0.35rem',
          }}
        />

        {/* College Identity */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            Vignan&apos;s Lara Institute <br />
            of Technology &amp; Science
          </div>
          <div
            style={{
              fontSize: '0.5625rem',
              color: '#93c5fd',
              fontWeight: 500,
              marginTop: '2px',
              letterSpacing: '0.03em',
            }}
          >
            Learn | Innovate | Grow
          </div>
        </div>
      </div>

      {/* Right Controls: Minimize & Close */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize chat"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'transparent',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close chat"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'transparent',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
