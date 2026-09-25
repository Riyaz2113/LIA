/**
 * FacultyStatCard
 * Reusable statistics card component matching the approved Faculty Portal reference cards.
 */
const FacultyStatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  color = '#2563eb',
  bg = '#eff6ff',
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.375rem',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}
      className="faculty-stat-card"
    >
      <div>
        <div
          style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.1,
            marginBottom: '0.2rem',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#64748b',
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: '0.6875rem',
              color: '#94a3b8',
              marginTop: '0.25rem',
            }}
          >
            {sub}
          </div>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: bg,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={22} strokeWidth={2.4} />
        </div>
      )}
    </div>
  );
};

export default FacultyStatCard;
