import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * AdminPagination
 * Pagination component matching the approved Admin reference footer.
 */
const AdminPagination = ({
  currentPage = 1,
  totalPages = 4,
  startEntry = 1,
  endEntry = 5,
  totalEntries = 1248,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderTop: '1px solid #f1f5f9',
        fontSize: '0.8125rem',
        color: '#64748b',
        backgroundColor: '#ffffff',
      }}
      className="admin-pagination-container"
    >
      <div>
        Showing <span style={{ fontWeight: 700, color: '#0f172a' }}>{startEntry}</span> to{' '}
        <span style={{ fontWeight: 700, color: '#0f172a' }}>{endEntry}</span> of{' '}
        <span style={{ fontWeight: 700, color: '#0f172a' }}>{totalEntries}</span> entries
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#64748b',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange && onPageChange(p)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isActive ? '#2563eb' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#64748b',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
