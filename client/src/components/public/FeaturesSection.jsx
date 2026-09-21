import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Briefcase, Users, MessageSquare, Bell } from 'lucide-react';

/**
 * FeaturesSection
 * "All You Need, In One Place" — 6 feature cards in a 3x2 grid matching the exact reference screenshot.
 * The "Exams & Results" card has the highlighted blue border as specified.
 */
const FeaturesSection = () => {
  const navigate = useNavigate();
  const features = [
    {
      id: 'academics',
      title: 'Academic Information',
      description: 'Timings, syllabus, results and more',
      icon: BookOpen,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      highlighted: false,
    },
    {
      id: 'exams',
      title: 'Exams & Results',
      description: 'Schedules, hall tickets and results',
      icon: Calendar,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      highlighted: true, // Subtle blue border highlight as shown in screenshot
    },
    {
      id: 'placements',
      title: 'Placements',
      description: 'Opportunities, drives and preparation resources',
      icon: Briefcase,
      iconBg: '#f0fdfa',
      iconColor: '#0d9488',
      highlighted: false,
    },
    {
      id: 'campus-life',
      title: 'Campus Life',
      description: 'Events, clubs, facilities and hostels',
      icon: Users,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
      highlighted: false,
    },
    {
      id: 'ai-assistance',
      title: 'AI Assistance',
      description: 'Get instant answers to your queries',
      icon: MessageSquare,
      iconBg: '#f0f9ff',
      iconColor: '#0284c7',
      highlighted: false,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Stay updated with important information',
      icon: Bell,
      iconBg: '#fff1f2',
      iconColor: '#e11d48',
      highlighted: false,
    },
  ];

  return (
    <section
      id="features"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.25rem' }}>
          <div className="section-tag" style={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.15em' }}>
            FEATURES
          </div>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
            }}
          >
            All You Need, <span style={{ color: '#2563eb' }}>In One Place</span>
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#64748b',
              maxWidth: '600px',
              marginInline: 'auto',
              lineHeight: 1.5,
            }}
          >
            Explore the powerful features that make LIA your everyday campus companion.
          </p>
        </div>

        {/* 6 Feature Cards in a 3x2 Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}
          className="features-3x2-grid"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => {
                  if (feature.id === 'ai-assistance') {
                    navigate('/chat');
                  }
                }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '2.25rem 1.75rem',
                  border: feature.highlighted ? '2px solid #93c5fd' : '1.5px solid #e2e8f0',
                  boxShadow: feature.highlighted
                    ? '0 8px 24px -4px rgba(37, 99, 235, 0.12), 0 0 0 1px #bfdbfe'
                    : '0 4px 12px -2px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                }}
                className="feature-card-item"
              >
                {/* Feature Icon Box */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: feature.iconBg,
                    color: feature.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    transition: 'transform 200ms ease',
                  }}
                  className="feature-icon-box"
                >
                  <Icon size={26} strokeWidth={2.2} />
                </div>

                {/* Feature Title */}
                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '0.5rem',
                    lineHeight: 1.25,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .features-3x2-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .features-3x2-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .feature-card-item:hover {
          transform: translateY(-3px);
          border-color: #93c5fd !important;
          box-shadow: 0 14px 28px -4px rgba(37, 99, 235, 0.12) !important;
        }
        .feature-card-item:hover .feature-icon-box {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
