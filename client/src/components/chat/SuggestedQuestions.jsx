import { GraduationCap, FileText, Calendar, Users, ChevronRight } from 'lucide-react';

/**
 * SuggestedQuestions
 * 2x2 grid of prompt suggestions matching REFERENCE 1.
 * Title with "See more >", styled icon boxes, and clean cards.
 */
const SuggestedQuestions = ({ onSelectQuestion }) => {
  const suggestions = [
    {
      id: 'hostels',
      text: 'What are the hostel facilities?',
      icon: GraduationCap,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      id: 'placements',
      text: 'How to apply for placements?',
      icon: FileText,
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
    },
    {
      id: 'exams',
      text: 'When are the next examinations?',
      icon: Calendar,
      iconBg: '#faf5ff',
      iconColor: '#a855f7',
    },
    {
      id: 'clubs',
      text: 'Tell me about campus clubs and events',
      icon: Users,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
  ];

  return (
    <div style={{ marginTop: '0.75rem', marginBottom: '1rem' }} className="lia-suggested-questions">
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.625rem',
        }}
      >
        <h4
          style={{
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
          }}
        >
          Suggested questions
        </h4>
        <button
          type="button"
          onClick={() => onSelectQuestion && onSelectQuestion('Show all suggested campus questions')}
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
          <span>See more</span>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.625rem',
        }}
        className="suggested-questions-grid"
      >
        {suggestions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectQuestion && onSelectQuestion(item.text)}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #f1f5f9',
                borderRadius: '14px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                transition: 'all 150ms ease',
              }}
              className="suggested-q-card"
            >
              {/* Icon Box */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: item.iconBg,
                  color: item.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={2.4} />
              </div>

              {/* Text */}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: 1.35,
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        .suggested-q-card:hover {
          border-color: #bfdbfe !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default SuggestedQuestions;
