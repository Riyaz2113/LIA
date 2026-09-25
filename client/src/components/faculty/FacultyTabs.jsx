/**
 * FacultyTabs
 * Reusable tab bar component with the active blue button styling from the reference design.
 */
const FacultyTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
        marginBottom: '1.25rem',
      }}
      className="faculty-tabs-container"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id || activeTab === tab.name || activeTab === tab;
        const tabKey = tab.id || tab.name || tab;
        const tabLabel = tab.name || tab.label || tab;

        return (
          <button
            key={tabKey}
            type="button"
            onClick={() => onTabChange(tabKey)}
            style={{
              padding: '0.55rem 1.2rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: isActive ? '#2563eb' : '#ffffff',
              color: isActive ? '#ffffff' : '#475569',
              boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            {tabLabel}
            {tab.count !== undefined && (
              <span
                style={{
                  marginLeft: '0.4rem',
                  fontSize: '0.6875rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FacultyTabs;
