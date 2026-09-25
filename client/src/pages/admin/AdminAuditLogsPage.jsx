import { useState, useEffect } from 'react';
import { Download, Clock, User, Shield } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import { auditLogService } from '../../services/auditLogService';

/**
 * AdminAuditLogsPage
 * Atlas-backed System activity tracking and immutable security audit logs.
 */
const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [moduleFilter, setModuleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditLogService.getAll({ module: moduleFilter, search: searchQuery });
      if (res && res.data) {
        setLogs(
          res.data.map((l) => ({
            id: l._id || l.id,
            user: l.user?.name ? `${l.user.name}` : 'System Admin',
            role: l.user?.role || 'ADMIN',
            action: l.action || 'MUTATION',
            module: l.module || 'GENERAL',
            date: l.createdAt
              ? new Date(l.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Recent',
            desc: l.description || l.action,
            ip: l.ipAddress || '127.0.0.1',
          }))
        );
      }
    } catch (err) {
      console.warn('Error fetching audit logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const filteredLogs = logs.filter((log) => {
    if (moduleFilter !== 'All' && log.module.toUpperCase() !== moduleFilter.toUpperCase()) return false;
    if (
      searchQuery &&
      !log.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <AdminPageHeader
        title="Audit & Activity Logs"
        description="Comprehensive audit trail of administrator and faculty actions across all institutional portal modules."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/settings' },
          { label: 'Audit Logs' },
        ]}
        actionLabel="Export Logs"
        actionIcon={Download}
        onAction={() => alert('Exporting system audit logs as CSV file...')}
      />

      {/* Filters */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search audit logs by user, action, or details..."
        filters={[
          {
            label: 'Module',
            value: moduleFilter,
            onChange: setModuleFilter,
            options: ['All', 'TIMETABLE', 'STUDENTS', 'FACULTY', 'NOTICES', 'EVENTS', 'PLACEMENTS', 'LIBRARY', 'MATERIALS', 'USERS'],
          },
        ]}
      />

      {/* Audit Logs Table */}
      <AdminTable
        columns={[
          { header: 'Timestamp', width: '190px' },
          { header: 'User / Account', width: '170px' },
          { header: 'Role', width: '120px' },
          { header: 'Action Executed', width: '180px' },
          { header: 'Module', width: '130px' },
          { header: 'Change Details / Description' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredLogs.length > 0 ? 1 : 0,
          endEntry: filteredLogs.length,
          totalEntries: filteredLogs.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading audit logs from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredLogs.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No audit logs recorded for this filter.
            </td>
          </tr>
        ) : (
          filteredLogs.map((log) => (
            <tr
              key={log.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.15s ease',
              }}
              className="admin-table-row"
            >
              {/* Timestamp */}
              <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="#94a3b8" />
                  {log.date}
                </div>
              </td>

              {/* User */}
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#2563eb" />
                  {log.user}
                </div>
              </td>

              {/* Role */}
              <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: log.role === 'ADMIN' ? '#eff6ff' : '#f8fafc',
                    color: log.role === 'ADMIN' ? '#1d4ed8' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: 600,
                  }}
                >
                  {log.role}
                </span>
              </td>

              {/* Action */}
              <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', fontSize: '12px', fontFamily: 'monospace' }}>
                {log.action}
              </td>

              {/* Module */}
              <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
                {log.module}
              </td>

              {/* Description */}
              <td style={{ padding: '14px 16px', color: '#334155', fontSize: '12.5px' }}>
                {log.desc}
              </td>
            </tr>
          ))
        )}
      </AdminTable>
    </div>
  );
};

export default AdminAuditLogsPage;
