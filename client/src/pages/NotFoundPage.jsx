import { useNavigate } from 'react-router-dom';

/**
 * NotFoundPage — 404 handler for unmatched routes.
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: '#f8fafc',
        color: '#0f172a',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '5rem', fontWeight: 800, color: '#1a2e5a', lineHeight: 1 }}>
        404
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>
        Page Not Found
      </div>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '400px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '1rem',
          padding: '0.625rem 1.5rem',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
