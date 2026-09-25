import { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Edit3,
  MoreVertical,
  Calendar,
  Users,
  X,
  Send,
  CheckCircle,
} from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyTabs from '../../components/faculty/FacultyTabs';
import FacultyTable from '../../components/faculty/FacultyTable';
import { noticeService } from '../../services/noticeService';

/**
 * FacultyAnnouncementsPage
 * Announcements management view matching the exact reference design.
 * Features "+ New Announcement" creation modal, Announcement & Notification tabs,
 * and announcements table with category badges (Academic, General, Events, Placements).
 */
const FacultyAnnouncementsPage = () => {
  const [activeTab, setActiveTab] = useState('Announcements');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states for announcement
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academic');
  const [newAudience, setNewAudience] = useState('All Students');
  const [newContent, setNewContent] = useState('');

  const tabs = [
    { id: 'Announcements', name: 'Announcements' },
    { id: 'Notifications', name: 'Notifications' },
  ];

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Internal Assessment Schedule', category: 'Academic', date: '18 Sep 2026', visibleTo: 'All Students', status: 'Published' },
    { id: 2, title: 'Project Review Meeting', category: 'General', date: '16 Sep 2026', visibleTo: 'III & IV Year', status: 'Published' },
    { id: 3, title: 'Tech Talk on GenAI', category: 'Events', date: '14 Sep 2026', visibleTo: 'All Students', status: 'Published' },
    { id: 4, title: 'Library Timings Update', category: 'General', date: '12 Sep 2026', visibleTo: 'All Students', status: 'Published' },
    { id: 5, title: 'Placement Drive - Infosys', category: 'Placements', date: '10 Sep 2026', visibleTo: 'Final Year', status: 'Published' },
  ]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await noticeService.getAll();
      if (res && res.data && res.data.length > 0) {
        setAnnouncements(res.data.map(n => ({
          id: n._id || n.id,
          title: n.title,
          category: n.category ? (n.category.charAt(0).toUpperCase() + n.category.slice(1).toLowerCase()) : 'Academic',
          date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
          visibleTo: n.targetAudience ? `${n.targetAudience.charAt(0).toUpperCase() + n.targetAudience.slice(1).toLowerCase()}s` : 'All Students',
          status: 'Published',
          content: n.content || '',
        })));
      }
    } catch (err) {
      console.warn('Using default announcements list:', err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingNoticeId(null);
    setNewTitle('');
    setNewCategory('Academic');
    setNewAudience('All Students');
    setNewContent('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingNoticeId(item.id);
    setNewTitle(item.title || '');
    setNewCategory(item.category || 'Academic');
    setNewAudience(item.visibleTo || 'All Students');
    setNewContent(item.content || '');
    setModalOpen(true);
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (editingNoticeId) {
      try {
        await noticeService.update(editingNoticeId, {
          title: newTitle.trim(),
          category: newCategory.toUpperCase(),
          targetAudience: newAudience === 'All Students' ? 'STUDENT' : 'ALL',
          content: newContent || 'Official institutional announcement.',
        });
        await fetchNotices();
      } catch {
        setAnnouncements(
          announcements.map((a) =>
            a.id === editingNoticeId
              ? { ...a, title: newTitle.trim(), category: newCategory, visibleTo: newAudience, content: newContent }
              : a
          )
        );
      }
      setToastMessage('✅ Announcement updated successfully!');
    } else {
      try {
        await noticeService.create({
          title: newTitle.trim(),
          category: newCategory.toUpperCase(),
          targetAudience: newAudience === 'All Students' ? 'STUDENT' : 'ALL',
          content: newContent || 'Official institutional announcement.',
        });
        await fetchNotices();
      } catch (err) {
        const newItem = {
          id: announcements.length + 1,
          title: newTitle.trim(),
          category: newCategory,
          date: '21 Sep 2026',
          visibleTo: newAudience,
          status: 'Published',
          content: newContent,
        };
        setAnnouncements([newItem, ...announcements]);
      }
      setToastMessage('📢 Announcement published successfully!');
    }

    setNewTitle('');
    setNewContent('');
    setEditingNoticeId(null);
    setModalOpen(false);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Academic':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'Events':
        return { bg: '#faf5ff', color: '#9333ea', border: '#f3e8ff' };
      case 'Placements':
        return { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' };
      case 'General':
      default:
        return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with + New Announcement Button */}
      <FacultyPageHeader
        title="Announcements"
        subtitle="Create and manage important announcements."
        rightContent={
          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.625rem 1.35rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'all 150ms ease',
            }}
          >
            <Plus size={16} />
            <span>New Announcement</span>
          </button>
        }
      />

      {/* 2. Tabs */}
      <FacultyTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            borderRadius: '10px',
            color: '#15803d',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* 3. Announcements Table */}
      <FacultyTable
        columns={[
          { header: '#', width: '50px' },
          { header: 'Title' },
          { header: 'Category', width: '140px' },
          { header: 'Date', width: '140px' },
          { header: 'Visible To', width: '150px' },
          { header: 'Status', width: '120px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
      >
        {announcements.map((item) => {
          const catBadge = getCategoryBadge(item.category);
          return (
            <tr
              key={item.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="faculty-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{item.id}</td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Megaphone size={16} color="#2563eb" />
                  <span>{item.title}</span>
                </div>
              </td>
              <td style={{ padding: '1rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: catBadge.bg,
                    color: catBadge.color,
                    border: `1px solid ${catBadge.border}`,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.category}
                </span>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {item.date}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                <span
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  {item.visibleTo}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.status}
                </span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    title="Edit Announcement"
                    onClick={() => handleOpenEdit(item)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      color: '#2563eb',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </FacultyTable>

      {/* Announcement Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          onClick={() => {
            setModalOpen(false);
            setEditingNoticeId(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingNoticeId ? 'Edit Announcement' : 'Publish New Announcement'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingNoticeId(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule for Mid-Term Lab Examinations"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      outline: 'none',
                    }}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Events">Events</option>
                    <option value="Placements">Placements</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Audience
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      outline: 'none',
                    }}
                  >
                    <option value="All Students">All Students</option>
                    <option value="III & IV Year">III &amp; IV Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Faculty Only">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Description / Body
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide full details, timings, and instructions..."
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
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
                    gap: '0.4rem',
                    padding: '0.55rem 1.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={15} />
                  <span>{editingNoticeId ? 'Save Changes' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .faculty-table-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default FacultyAnnouncementsPage;
