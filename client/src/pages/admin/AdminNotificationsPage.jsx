import { useState, useEffect } from 'react';
import { Plus, Bell, Send, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { notificationService } from '../../services/notificationService';

/**
 * AdminNotificationsPage
 * Atlas-backed Notification broadcasting center for student, faculty, and system alerts.
 */
const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll();
      if (res && res.data) {
        setNotifications(
          res.data.map((n) => ({
            id: n._id || n.id,
            title: n.title,
            message: n.message,
            audience: n.recipientType ? `${n.recipientType.charAt(0) + n.recipientType.slice(1).toLowerCase()}s` : 'All Users',
            type: n.type || 'INFO',
            date: n.createdAt
              ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Recent',
            status: n.isRead ? 'Read' : 'Delivered',
          }))
        );
      }
    } catch (err) {
      showToast('Error loading notification broadcast history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'All Users',
    type: 'INFO',
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      message: '',
      audience: 'All Users',
      type: 'INFO',
    });
    setModalOpen(true);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;

    try {
      let aud = 'ALL';
      if (formData.audience === 'Students' || formData.audience === 'All Students') aud = 'STUDENTS';
      else if (formData.audience === 'Faculty' || formData.audience === 'All Faculty') aud = 'FACULTY';

      const res = await notificationService.broadcast({
        title: formData.title,
        message: formData.message,
        audience: aud,
        type: formData.type.toUpperCase(),
      });

      showToast(res.data?.message || 'Notification broadcast sent successfully!');
      await fetchNotifications();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to broadcast notification.', 'error');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (audienceFilter !== 'All' && n.audience !== audienceFilter) return false;
    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toastType === 'error' ? '#ef4444' : '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '13.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {toastType === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="Broadcast Notifications"
        description="Send instant alerts, push notifications, and banner advisories across the institutional portal."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/settings' },
          { label: 'Notifications' },
        ]}
        actionLabel="Send Broadcast"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notifications by title or message..."
        filters={[
          {
            label: 'Target Audience',
            value: audienceFilter,
            onChange: setAudienceFilter,
            options: ['All', 'All Users', 'Students', 'Faculty'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Notification Details' },
          { header: 'Audience', width: '150px' },
          { header: 'Type / Alert', width: '130px' },
          { header: 'Date Sent', width: '150px' },
          { header: 'Status', width: '130px' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredNotifications.length > 0 ? 1 : 0,
          endEntry: filteredNotifications.length,
          totalEntries: filteredNotifications.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading broadcast history from Atlas...
            </td>
          </tr>
        ) : filteredNotifications.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No broadcast notifications found.
            </td>
          </tr>
        ) : (
          filteredNotifications.map((n) => (
            <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      flexShrink: 0,
                    }}
                  >
                    <Bell size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.message}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {n.audience}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb' }}>
                {n.type}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                {n.date}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={n.status} />
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      {/* Modal for Broadcast */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Broadcast Notification"
      >
        <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Alert Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mandatory Attendance Advisory"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Message Text *
            </label>
            <textarea
              rows={3}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter the broadcast notification message..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Target Recipients
              </label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="All Users">All Users (Campus-Wide)</option>
                <option value="Students">All Students Only</option>
                <option value="Faculty">All Faculty Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Notification Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="INFO">Information (Blue)</option>
                <option value="WARNING">Warning (Amber)</option>
                <option value="ALERT">Critical Alert (Red)</option>
                <option value="SUCCESS">Success (Green)</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '8px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <Send size={15} />
              Broadcast Now
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminNotificationsPage;
