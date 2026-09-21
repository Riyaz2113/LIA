/**
 * OnlineStatus
 * Green status indicator card matching Reference 2.
 * Displays glowing online circle, "LIA is Online", and "Ready to assist you 24/7".
 */
const OnlineStatus = () => {
  return (
    <div
      style={{
        backgroundColor: '#f0fdf4',
        border: '1.5px solid #bbf7d0',
        borderRadius: '16px',
        padding: '0.875rem 1.125rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        boxShadow: '0 4px 12px -2px rgba(34, 197, 94, 0.08)',
        marginBottom: '1.25rem',
      }}
      className="lia-online-status-card"
    >
      {/* Green Glowing Circle */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.25)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
          }}
        />
      </div>

      {/* Status Text */}
      <div>
        <div
          style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: '#15803d',
            lineHeight: 1.2,
          }}
        >
          LIA is Online
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#4b7a5a',
            marginTop: '2px',
            fontWeight: 500,
          }}
        >
          Ready to assist you 24/7
        </div>
      </div>
    </div>
  );
};

export default OnlineStatus;
