import { useState, useEffect } from 'react';
import { Plus, Bell, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import noticeService from '../../services/noticeService';

/**
 * AdminNoticesPage
 * Atlas-backed Notices & Campus Circulars CMS with instant cross-portal propagation.
 */
const AdminNoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [deleteConfirmNotice, setDeleteConfirmNotice] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await noticeService.getAll({ category: categoryFilter, isPublished: 'true' });
      if (res && res.data) {
        const mapped = res.data.map((n) => ({
          id: n._id || n.id,
          title: n.title,
          description: n.description || '',
          category: n.category ? n.category.charAt(0) + n.category.slice(1).toLowerCase() : 'Academic',
          priority: n.priority || 'NORMAL',
          date: n.publishDate
            ? new Date(n.publishDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '18 Sep 2026',
          status: n.isPublished !== false ? 'Published' : 'Draft',
        }));
        setNotices(mapped);
      }
    } catch {
      showToast('Unable to load notices from MongoDB Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, [categoryFilter]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'NORMAL',
    status: 'Published',
  });

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      priority: 'NORMAL',
      status: 'Published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description || notice.title,
      category: notice.category,
      priority: notice.priority || 'NORMAL',
      status: notice.status,
    });
    setModalOpen(true);
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      if (editingNotice && editingNotice.id) {
        await noticeService.update(editingNotice.id, {
          title: formData.title,
          description: formData.description || formData.title,
          category: formData.category.toUpperCase(),
          priority: formData.priority.toUpperCase(),
          isPublished: formData.status === 'Published',
        });
        showToast(`Notice "${formData.title}" updated in Atlas.`);
      } else {
        await noticeService.create({
          title: formData.title,
          description: formData.description || formData.title,
          category: formData.category.toUpperCase(),
          priority: formData.priority.toUpperCase(),
          isPublished: formData.status === 'Published',
        });
        showToast(`Notice "${formData.title}" published to Student & Faculty portals!`);
      }
      await loadNotices();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save notice.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmNotice) return;
    try {
      await noticeService.delete(deleteConfirmNotice.id);
      showToast('Notice permanently deleted from Atlas.');
      await loadNotices();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete notice.', 'error');
    } finally {
      setDeleteConfirmNotice(null);
    }
  };

  const filteredNotices = notices.filter((n) => {
    if (categoryFilter !== 'All' && n.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Notices & Circulars CMS"
        description="Broadcast official circulars, exam notifications, and campus bulletins live across all portals."
        breadcrumbs={[
          { label: 'Campus', path: '/admin' },
          { label: 'Notices' },
        ]}
        actionLabel="Create Notice"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notices by title or category..."
        filters={[
          {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: ['All', 'Academic', 'Exam', 'Event', 'General', 'Hostel', 'Placement'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Notice Title' },
          { header: 'Category', width: '150px' },
          { header: 'Published Date', width: '150px' },
          { header: 'Status', width: '130px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredNotices.length > 0 ? 1 : 0,
          endEntry: filteredNotices.length,
          totalEntries: filteredNotices.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading notices from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredNotices.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No notices found.
            </td>
          </tr>
        ) : (
          filteredNotices.map((notice) => (
            <tr key={notice.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
                      {notice.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {notice.description?.slice(0, 70)}...
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {notice.category}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                {notice.date}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={notice.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(notice)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #2563eb',
                      color: '#2563eb',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmNotice(notice)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      {/* Modal for Create / Edit Notice */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNotice ? 'Edit Campus Notice' : 'Publish New Campus Notice'}
      >
        <form onSubmit={handleSaveNotice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. End Semester Exam Fee Notification"
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
              Description & Details *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full text of the circular..."
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                <option value="Academic">Academic</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
                <option value="General">General</option>
                <option value="Hostel">Hostel</option>
                <option value="Placement">Placement</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft (Hidden)</option>
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
              {editingNotice ? 'Update Notice' : 'Publish to Portals'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmNotice && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmNotice(null)}
          title="Confirm Notice Deletion"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete the notice{' '}
              <strong style={{ color: '#0f172a' }}>"{deleteConfirmNotice.title}"</strong>?
              This circular will be immediately removed from MongoDB Atlas and will no longer appear on Student or Faculty dashboards.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmNotice(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Yes, Delete Notice
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminNoticesPage;
