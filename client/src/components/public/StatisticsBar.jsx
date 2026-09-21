import { Users, UserCheck, Building2, Award } from 'lucide-react';

/**
 * StatisticsBar
 * 4 key campus statistics displayed horizontally matching the TOP reference screenshot.
 * Icon box on left, numbers & label on right, with subtle dividers.
 */
const StatisticsBar = () => {
  const stats = [
    {
      id: 'students',
      value: '4000+',
      label: 'Students',
      icon: Users,
    },
    {
      id: 'faculty',
      value: '300+',
      label: 'Faculty Members',
      icon: UserCheck,
    },
    {
      id: 'departments',
      value: '20+',
      label: 'Departments',
      icon: Building2,
    },
    {
      id: 'events',
      value: '100+',
      label: 'Events Every Year',
      icon: Award,
    },
  ];

  return (
    <section
      style={{
        paddingTop: '0.75rem',
        paddingBottom: '2.5rem',
        backgroundColor: '#f8fafc',
      }}
      className="lia-statistics-section"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            padding: '1.25rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          }}
          className="stats-grid-card"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  paddingLeft: idx > 0 ? '1rem' : '0',
                  borderLeft: idx > 0 ? '1px solid #f1f5f9' : 'none',
                }}
                className="stat-col-item"
              >
                {/* Stat Icon Box */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} strokeWidth={2.3} />
                </div>

                {/* Stat Numbers & Label */}
                <div>
                  <div
                    style={{
                      fontSize: '1.625rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#64748b',
                      marginTop: '0.15rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .stats-grid-card {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
            padding: 1.25rem !important;
          }
          .stat-col-item {
            border-left: none !important;
            padding-left: 0 !important;
            justify-content: flex-start !important;
          }
        }
        @media (max-width: 540px) {
          .stats-grid-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatisticsBar;
