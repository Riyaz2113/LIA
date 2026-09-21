import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginBrandPanel from '../../components/auth/LoginBrandPanel';
import LoginForm from '../../components/auth/LoginForm';

/**
 * LoginPage
 * Recreates the split-screen portal login design from the exact reference image.
 * Left: Campus branding panel with monument and feature highlights.
 * Right: Floating login card with role tabs, form fields, Google SSO button, and bottom bar.
 */
const LoginPage = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-select role if specified in query string (e.g. ?role=STUDENT from Homepage Quick Access)
  const initialRole = searchParams.get('role')?.toUpperCase();
  const validRole = ['STUDENT', 'FACULTY', 'ADMIN'].includes(initialRole) ? initialRole : 'STUDENT';

  const [selectedRole, setSelectedRole] = useState(validRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ── Redirect if already authenticated ─────────────────────────────────────
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'STUDENT') {
        navigate('/student', { replace: true });
      } else if (user.role === 'FACULTY') {
        navigate('/faculty', { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // ── Handle Form Submit ───────────────────────────────────────────────────
  const handleLoginSubmit = async ({ identifier, password }) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const data = await login(identifier, password);
      const authenticatedUser = data.user;

      // Navigate to respective role portal
      if (authenticatedUser.role === 'STUDENT') {
        navigate('/student', { replace: true });
      } else if (authenticatedUser.role === 'FACULTY') {
        navigate('/faculty', { replace: true });
      } else if (authenticatedUser.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Invalid credentials. Please check your login details and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        justifyContent: 'space-between',
      }}
    >
      {/* Main Split Screen Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1240px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
          className="login-split-grid"
        >
          {/* Left Column: Campus & LIA Brand Panel */}
          <div style={{ height: '100%' }} className="login-left-panel">
            <LoginBrandPanel />
          </div>

          {/* Right Column: Slogan + Floating Login Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Top Right Handwritten Slogan: "Empowering Minds for a Better Tomorrow" */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginBottom: '1.25rem',
                paddingRight: '1rem',
              }}
              className="login-top-slogan"
            >
              <div
                className="cursive-slogan-hero"
                style={{
                  fontSize: '1.4375rem',
                  color: '#1d4ed8',
                  transform: 'rotate(-2.5deg)',
                  textAlign: 'right',
                  lineHeight: 1.15,
                }}
              >
                &ldquo;Empowering Minds <br />
                for a Better Tomorrow&rdquo;
              </div>

              {/* Blue Curved Accent Underline (matching screenshot) */}
              <svg width="120" height="12" viewBox="0 0 120 12" fill="none" style={{ marginTop: '2px', marginRight: '4px' }}>
                <path d="M 5 6 Q 60 12 115 4" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Login Card Form */}
            <LoginForm
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
              onSubmit={handleLoginSubmit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar (Dark Navy matching reference) */}
      <div
        style={{
          backgroundColor: '#071126',
          color: '#ffffff',
          padding: '0.875rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.8125rem',
            color: '#94a3b8',
          }}
        >
          <div>
            &copy; 2026 LIA &ndash; Vignan&apos;s Lara Institute of Technology &amp; Science. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a href="#privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy</a>
            <span>|</span>
            <a href="#terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms</a>
            <span>|</span>
            <a href="#support" style={{ color: '#94a3b8', textDecoration: 'none' }}>Support</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .login-split-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
            min-height: 660px;
          }
        }
        @media (max-width: 959px) {
          .login-top-slogan {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
