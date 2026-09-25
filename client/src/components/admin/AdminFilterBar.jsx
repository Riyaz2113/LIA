import { Search } from 'lucide-react';

/**
 * AdminFilterBar
 * Card container for filter dropdowns, search input, and action triggers.
 */
const AdminFilterBar = ({
  filters = [],
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  rightAction,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1.5px solid #e2e8f0',
        padding: '0.875rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
      className="admin-filter-bar"
    >
      {/* Left: Selectors & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap', flex: 1 }}>
        {filters.map((f, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {f.label && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                {f.label}:
              </span>
            )}
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
                minWidth: f.minWidth || '140px',
              }}
            >
              {f.options.map((opt, oIdx) => (
                <option key={oIdx} value={typeof opt === 'object' ? opt.value : opt}>
                  {typeof opt === 'object' ? opt.label : opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Search Input */}
        {onSearchChange !== undefined && (
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '360px' }}>
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

      {/* Right: Export or Action Button */}
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
};

export default AdminFilterBar;
