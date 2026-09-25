import { FolderOpen } from 'lucide-react';

/**
 * AdminEmptyState
 * Empty state container when no records match a search or filter.
 */
const AdminEmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters.',
  action,
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1.5px dashed #cbd5e1',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '380px', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default AdminEmptyState;
