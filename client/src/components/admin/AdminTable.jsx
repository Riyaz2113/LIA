import AdminPagination from './AdminPagination';

/**
 * AdminTable
 * Standardized responsive data table matching the reference designs.
 */
const AdminTable = ({
  columns,
  children,
  pagination,
  emptyMessage,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        overflow: 'hidden',
      }}
      className="admin-table-card"
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '0.875rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    textAlign: col.align || 'left',
                    width: col.width || 'auto',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>

      {pagination && <AdminPagination {...pagination} />}
    </div>
  );
};

export default AdminTable;
