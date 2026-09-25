import { Search } from 'lucide-react';

/**
 * FacultyFilterBar
 * Card container housing dropdown selectors, search input, and action buttons.
 */
const FacultyFilterBar = ({
  filters = [],
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  actionButton,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1.5px solid #e2e8f0',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
      className="faculty-filter-bar"
    >
      {/* Left: Dropdown select elements */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
        {filters.map((f, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {f.label && (
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {f.label}
              </label>
            )}
            {f.type === 'date' ? (
              <input
                type="date"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                }}
              />
            ) : (
              <select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: f.minWidth || '160px',
                }}
              >
                {f.options.map((opt, oIdx) => (
                  <option key={oIdx} value={typeof opt === 'object' ? opt.value : opt}>
                    {typeof opt === 'object' ? opt.label : opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Search input (if enabled) */}
        {onSearchChange !== undefined && (
          <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '320px', marginTop: filters.some(f => f.label) ? '1rem' : 0 }}>
            <Search
              size={15}
              color="#94a3b8"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8125rem',
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* Right: Optional Action Button (e.g. Mark Attendance, Save) */}
      {actionButton && (
        <div>
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default FacultyFilterBar;
