import { useState, useEffect } from 'react';
import { Plus, Edit3, Calendar, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import eventService from '../../services/eventService';

/**
 * AdminEventsPage
 * Atlas-backed Campus Events CMS with real-time sync across Student & Faculty portals.
 */
const AdminEventsPage = () => {
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAll({
        timeline: activeTab === 'Upcoming Events' ? 'upcoming' : 'past',
        category: categoryFilter,
      });
      if (res && res.data) {
        const mapped = res.data.map((ev) => ({
          id: ev._id || ev.id,
          title: ev.title,
          description: ev.description || '',
          category: ev.category ? ev.category.charAt(0) + ev.category.slice(1).toLowerCase() : 'Technical',
          date: ev.date
            ? new Date(ev.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Oct 05, 2026',
          rawDate: ev.date ? new Date(ev.date).toISOString().split('T')[0] : '',
          venue: ev.venue || 'Main Auditorium',
          status: ev.status === 'UPCOMING' ? 'Published' : ev.status === 'COMPLETED' ? 'Completed' : 'Draft',
        }));
        setEvents(mapped);
      }
    } catch {
      showToast('Unable to load events from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [activeTab, categoryFilter]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    venue: 'Main Auditorium',
    status: 'Published',
  });

  const tabs = [
    { id: 'Upcoming Events', name: 'Upcoming Events' },
    { id: 'Past Events', name: 'Past Events' },
  ];

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      date: new Date().toISOString().split('T')[0],
      venue: 'Main Auditorium',
      status: 'Published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      description: ev.description || '',
      category: ev.category,
      date: ev.rawDate || new Date().toISOString().split('T')[0],
      venue: ev.venue,
      status: ev.status,
    });
    setModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    try {
      if (editingEvent && editingEvent.id) {
        await eventService.update(editingEvent.id, {
          title: formData.title,
          description: formData.description,
          category: formData.category.toUpperCase(),
          date: formData.date,
          venue: formData.venue,
          status: formData.status === 'Published' ? 'UPCOMING' : 'COMPLETED',
        });
        showToast(`Event "${formData.title}" updated in Atlas.`);
      } else {
        await eventService.create({
          title: formData.title,
          description: formData.description,
          category: formData.category.toUpperCase(),
          date: formData.date,
          venue: formData.venue,
          status: formData.status === 'Published' ? 'UPCOMING' : 'COMPLETED',
        });
        showToast(`Event "${formData.title}" created successfully!`);
      }
      await loadEvents();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save event.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmEvent) return;
    try {
      await eventService.delete(deleteConfirmEvent.id);
      showToast('Event deleted from Atlas.');
      await loadEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete event.', 'error');
    } finally {
      setDeleteConfirmEvent(null);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (categoryFilter !== 'All' && ev.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (
      searchQuery &&
      !ev.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.venue.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Campus Events CMS"
        description="Schedule technical fests, symposiums, guest lectures, and cultural events across the institution."
        breadcrumbs={[
          { label: 'Campus', path: '/admin' },
          { label: 'Events' },
        ]}
        actionLabel="Add Event"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Tabs */}
      <div style={{ marginBottom: '1rem' }}>
        <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search events by name, hall or organizer..."
        filters={[
          {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Seminar'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Event Title' },
          { header: 'Category', width: '150px' },
          { header: 'Event Date', width: '150px' },
          { header: 'Venue / Hall', width: '200px' },
          { header: 'Status', width: '130px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredEvents.length > 0 ? 1 : 0,
          endEntry: filteredEvents.length,
          totalEntries: filteredEvents.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading events from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredEvents.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No events found in this category.
            </td>
          </tr>
        ) : (
          filteredEvents.map((ev) => (
            <tr key={ev.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ev.venue}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {ev.category}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                {ev.date}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#0f172a' }}>
                {ev.venue}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={ev.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ev)}
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
                    onClick={() => setDeleteConfirmEvent(ev)}
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

      {/* Modal for Create / Edit Event */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Campus Event' : 'Add New Campus Event'}
      >
        <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. National Technical Symposium 2026"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Venue / Auditorium
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Main Auditorium"
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
                Status
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
                <option value="Published">Published (Active)</option>
                <option value="Completed">Completed</option>
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
              {editingEvent ? 'Update Event' : 'Save Event to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmEvent && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmEvent(null)}
          title="Confirm Event Deletion"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0f172a' }}>"{deleteConfirmEvent.title}"</strong>?
              This event will be deleted from MongoDB Atlas and removed from Student and Faculty schedules.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmEvent(null)}
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
                Yes, Delete Event
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminEventsPage;
