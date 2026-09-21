import { GraduationCap, FileText, Briefcase, Users, ChevronRight } from 'lucide-react';

/**
 * QuickHelp
 * Quick help categories matching Reference 2.
 * 4 cards with custom icons, titles, subtitles, and chevron arrows.
 */
const QuickHelp = ({ onSelectTopic }) => {
  const categories = [
    {
      id: 'academic',
      title: 'Academic Information',
      description: 'Timings, syllabus, curriculum, regulations',
      icon: GraduationCap,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      query: 'Tell me about Academic Information, timings and syllabus.',
    },
    {
      id: 'exams',
      title: 'Exams & Results',
      description: 'Schedules, hall tickets, results',
      icon: FileText,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      query: 'When are the upcoming examinations and how can I view results?',
    },
    {
      id: 'placements',
      title: 'Placements',
      description: 'Drives, preparation resources, opportunities',
      icon: Briefcase,
      iconBg: '#f0fdfa',
      iconColor: '#0d9488',
      query: 'How to apply for placement drives and preparation resources?',
    },
    {
      id: 'campus',
      title: 'Campus Life',
      description: 'Events, clubs, hostels, facilities',
      icon: Users,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
      query: 'Tell me about campus clubs, hostel facilities and upcoming events.',
    },
  ];

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Title Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.875rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.0625rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
          }}
        >
          Quick Help
        </h3>
        <button
          type="button"
          onClick={() => onSelectTopic && onSelectTopic('Tell me about all campus services')}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span>View All</span>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* 4 Category Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectTopic && onSelectTopic(cat.query)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                backgroundColor: '#ffffff',
                border: '1.5px solid #f1f5f9',
                borderRadius: '16px',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                cursor: 'pointer',
                transition: 'all 160ms ease',
              }}
              className="quick-help-card-item"
            >
              {/* Icon & Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: cat.iconBg,
                    color: cat.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.25,
                      marginBottom: '2px',
                    }}
                  >
                    {cat.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7188rem',
                      color: '#64748b',
                      lineHeight: 1.3,
                    }}
                  >
                    {cat.description}
                  </div>
                </div>
              </div>

              {/* Right Chevron */}
              <div style={{ color: '#2563eb', flexShrink: 0 }}>
                <ChevronRight size={16} strokeWidth={2.5} />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .quick-help-card-item:hover {
          border-color: #bfdbfe !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -2px rgba(37, 99, 235, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default QuickHelp;
