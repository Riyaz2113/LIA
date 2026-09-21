import { Link } from 'react-router-dom';
import { GraduationCap, Users, Shield, User, ChevronRight } from 'lucide-react';

/**
 * QuickAccessCards
 * 4 portal quick access shortcut cards sitting immediately below the hero section
 * matching the exact geometry, card dimensions, and spacing from the approved reference.
 */
const QuickAccessCards = () => {
  const cards = [
    {
      id: 'student',
      title: 'Student Login',
      description: 'Access classes, assignments, results, events and more',
      icon: GraduationCap,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      link: '/login?role=STUDENT',
    },
    {
      id: 'faculty',
      title: 'Faculty Login',
      description: 'Manage courses, attendance, assignments and notifications',
      icon: Users,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      link: '/login?role=FACULTY',
    },
    {
      id: 'admin',
      title: 'Admin Login',
      description: 'Manage users, departments, academic data and more',
      icon: Shield,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      link: '/login?role=ADMIN',
    },
    {
      id: 'guest',
      title: 'Explore as Guest',
      description: 'View public information, events and notices',
      icon: User,
      iconBg: '#f0f9ff',
      iconColor: '#0284c7',
      link: '#features',
      isAnchor: true,
    },
  ];

  return (
    <section
      style={{
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        backgroundColor: '#f8fafc',
      }}
      className="lia-quick-access-section"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
          }}
          className="quick-access-grid-layout"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            const content = (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.125rem 1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  transition: 'all 160ms ease',
                  cursor: 'pointer',
                  height: '100%',
                }}
                className="quick-card-hover-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  {/* Icon Box */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: card.iconBg,
                      color: card.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.15rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        lineHeight: 1.35,
                        margin: 0,
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Right Arrow */}
                <div style={{ color: '#94a3b8', marginLeft: '0.5rem', flexShrink: 0 }}>
                  <ChevronRight size={18} strokeWidth={2.2} />
                </div>
              </div>
            );

            return card.isAnchor ? (
              <a key={card.id} href={card.link} style={{ textDecoration: 'none' }}>
                {content}
              </a>
            ) : (
              <Link key={card.id} to={card.link} style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .quick-access-grid-layout {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .quick-access-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
        .quick-card-hover-item:hover {
          border-color: #93c5fd !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.12) !important;
        }
      `}</style>
    </section>
  );
};

export default QuickAccessCards;
