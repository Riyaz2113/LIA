/**
 * AdminStatCard
 * Reusable statistics card component matching the approved Admin Portal reference cards.
 * Features value, label, percentage badge (+3.4%), icon, and clean card styling.
 */
const AdminStatCard = ({
  label,
  value,
  change,
  isPositive = true,
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
      className="admin-stat-card"
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
          {change && (
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
                color: isPositive ? '#15803d' : '#b91c1c',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
              }}
            >
              {change}
            </span>
          )}
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

export default AdminStatCard;
