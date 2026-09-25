/**
 * AdminPageHeader
 * Consistent header banner for all Admin Portal subpages.
 * Displays page title, subtitle description, and optional action buttons.
 */
const AdminPageHeader = ({ title, subtitle, rightContent }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
      className="admin-page-header"
    >
      <div>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            margin: '0 0 0.25rem 0',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {rightContent && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;
