import { ExternalLink } from 'lucide-react';

/**
 * ActionButtons
 * Interactive outlined CTA action buttons beneath assistant messages.
 * Matching REFERENCE 1: "View Academic Calendar" (with open icon) & "Show key dates".
 */
const ActionButtons = ({ onActionClick }) => {
  const actions = [
    { id: 'view_calendar', label: 'View Academic Calendar', hasIcon: true },
    { id: 'show_dates', label: 'Show key dates', hasIcon: false },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.625rem',
        marginLeft: '44px',
        marginBottom: '1.25rem',
      }}
      className="lia-action-buttons"
    >
      {actions.map((act) => (
        <button
          key={act.id}
          type="button"
          onClick={() => onActionClick && onActionClick(act.label)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#2563eb',
            backgroundColor: '#ffffff',
            border: '1.5px solid #2563eb',
            borderRadius: '9999px',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#eff6ff';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'none';
          }}
        >
          {act.hasIcon && <ExternalLink size={14} strokeWidth={2.4} />}
          <span>{act.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
