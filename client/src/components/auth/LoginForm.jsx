import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import RoleSelector from './RoleSelector';

/**
 * LoginForm
 * The right side floating login card component.
 * Integrates with AuthContext and supports Student, Faculty, and Admin portals.
 */
const LoginForm = ({
  selectedRole,
  onSelectRole,
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Dynamic field labels & placeholders based on role
  const getIdentifierConfig = () => {
    switch (selectedRole) {
      case 'STUDENT':
        return {
          label: 'Roll Number / Email',
          placeholder: 'Enter your roll number or email',
        };
      case 'FACULTY':
        return {
          label: 'Employee ID / Email',
          placeholder: 'Enter your employee ID or email',
        };
      case 'ADMIN':
      default:
        return {
          label: 'Email Address',
          placeholder: 'Enter your email',
        };
    }
  };

  const identifierConfig = getIdentifierConfig();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;
    onSubmit({ identifier: identifier.trim(), password, role: selectedRole });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px #e2e8f0',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.375rem',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome to <span style={{ color: '#2563eb' }}>LIA</span>
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
          }}
        >
          Login to access your personalized portal
        </p>
      </div>

      {/* Role Selection Tabs (Student / Faculty / Admin) */}
      <RoleSelector
        selectedRole={selectedRole}
        onSelectRole={onSelectRole}
        disabled={isSubmitting}
      />

      {/* Error Alert Message */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#b91c1c',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Identifier Field (Email / Roll Number) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="identifier-input"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.5rem',
            }}
          >
            {identifierConfig.label}
          </label>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <Mail size={18} />
            </div>
            <input
              id="identifier-input"
              type="text"
              required
              disabled={isSubmitting}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={identifierConfig.placeholder}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.625rem',
                fontSize: '0.9375rem',
                color: '#0f172a',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="password-input"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.5rem',
            }}
          >
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <Lock size={18} />
            </div>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '0.75rem 2.75rem 0.75rem 2.625rem',
                fontSize: '0.9375rem',
                color: '#0f172a',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#475569',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#2563eb',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => alert('Please contact your department administrator to reset your credentials.')}
            style={{
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: 'none',
              border: 'none',
            }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.8125rem 1.5rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            transition: 'all 150ms ease',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.75 : 1,
          }}
          className="login-submit-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Divider OR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0',
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
      </div>

      {/* Continue with Google Button (Disabled notice as specified) */}
      <button
        type="button"
        onClick={() => alert('Google authentication is managed by institutional SSO. Please use your standard credentials above.')}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: '#ffffff',
          color: '#334155',
          border: '1.5px solid #e2e8f0',
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        {/* Google G Logo SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Footer Support Text */}
      <div
        style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: '#64748b',
        }}
      >
        Don&apos;t have an account?{' '}
        <span style={{ color: '#2563eb', fontWeight: 600 }}>Contact your department.</span>
      </div>

      <style>{`
        .login-submit-btn:hover:not(:disabled) {
          background-color: #1d4ed8 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4) !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
