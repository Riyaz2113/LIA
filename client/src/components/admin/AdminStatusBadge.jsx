/**
 * AdminStatusBadge
 * Standardized status pill badge for all Admin tables.
 */
const AdminStatusBadge = ({ status }) => {
  const getBadgeStyle = (s) => {
    const st = s ? s.toLowerCase() : '';
    if (st.includes('active') || st.includes('published') || st.includes('open') || st.includes('submitted')) {
      return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
    }
    if (st.includes('scheduled') || st.includes('upcoming')) {
      return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
    }
    if (st.includes('under review') || st.includes('draft') || st.includes('pending')) {
      return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
    }
    if (st.includes('inactive') || st.includes('rejected') || st.includes('archived')) {
      return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    }
    return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
  };

  const style = getBadgeStyle(status);

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};

export default AdminStatusBadge;
