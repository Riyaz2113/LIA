import { useState, useEffect } from 'react';
import { Plus, Edit3, BookOpen, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import subjectService from '../../services/subjectService';

/**
 * AdminSubjectsPage
 * Atlas-backed Subject & Curriculum CMS.
 */
const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteConfirmSubject, setDeleteConfirmSubject] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getAll();
      if (res && res.data) {
        const mapped = res.data.map((s) => ({
          id: s._id || s.id,
          code: s.code,
          name: s.name,
          department: s.department?.code || 'CSE',
          semester: `Semester ${s.semester || 1}`,
          semNumber: s.semester || 1,
          credits: s.credits || 4,
          type: s.type || 'THEORY',
          status: s.isActive !== false ? 'Active' : 'Inactive',
        }));
        setSubjects(mapped);
      }
    } catch {
      showToast('Error loading subjects from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'CSE',
    semester: '1',
    credits: 4,
    type: 'THEORY',
  });

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setFormData({
      code: '',
      name: '',
      department: 'CSE',
      semester: '1',
      credits: 4,
      type: 'THEORY',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSubject(s);
    setFormData({
      code: s.code,
      name: s.name,
      department: s.department,
      semester: String(s.semNumber || 1),
      credits: s.credits,
      type: s.type || 'THEORY',
    });
    setModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        department: formData.department,
        semester: Number(formData.semester),
        credits: Number(formData.credits),
        type: formData.type,
      };

      if (editingSubject && editingSubject.id) {
        await subjectService.update(editingSubject.id, payload);
        showToast(`Subject ${formData.code.toUpperCase()} updated in Atlas.`);
      } else {
        await subjectService.create(payload);
        showToast(`Subject ${formData.code.toUpperCase()} created in Atlas!`);
      }
      await loadSubjects();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save subject.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmSubject) return;
    try {
      await subjectService.delete(deleteConfirmSubject.id);
      showToast(`Subject ${deleteConfirmSubject.code} deactivated.`);
      await loadSubjects();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to deactivate subject.', 'error');
    } finally {
      setDeleteConfirmSubject(null);
    }
  };

  const filteredSubjects = subjects.filter((subj) => {
    if (deptFilter !== 'All' && subj.department !== deptFilter) return false;
    if (
      searchQuery &&
      !subj.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !subj.code.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Subjects & Curriculum CMS"
        description="Configure academic subjects, syllabus codes, credit weights, and course mappings."
        breadcrumbs={[
          { label: 'Academics', path: '/admin/academics' },
          { label: 'Subjects' },
        ]}
        actionLabel="Add Subject"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search subject by code or name..."
        filters={[
          {
            label: 'Department',
            value: deptFilter,
            onChange: setDeptFilter,
            options: ['All', 'CSE', 'AIML', 'ECE', 'EEE', 'ME'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Subject Code', width: '130px' },
          { header: 'Subject Name' },
          { header: 'Department', width: '130px' },
          { header: 'Semester', width: '130px' },
          { header: 'Credits', width: '90px' },
          { header: 'Type', width: '110px' },
          { header: 'Status', width: '110px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredSubjects.length > 0 ? 1 : 0,
          endEntry: filteredSubjects.length,
          totalEntries: filteredSubjects.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading subjects from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredSubjects.length === 0 ? (
          <tr>
            <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No subjects found matching criteria.
            </td>
          </tr>
        ) : (
          filteredSubjects.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 800, color: '#2563eb' }}>
                {s.code}
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {s.department}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {s.semester}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                {s.credits}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>
                {s.type}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={s.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(s)}
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
                    onClick={() => setDeleteConfirmSubject(s)}
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

      {/* Add / Edit Subject Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
      >
        <form onSubmit={handleSaveSubject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CS401"
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
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Compiler Design"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                <option value="CSE">CSE</option>
                <option value="AIML">AIML</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
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
                Type
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
                <option value="THEORY">THEORY</option>
                <option value="LAB">LAB</option>
                <option value="ELECTIVE">ELECTIVE</option>
                <option value="PROJECT">PROJECT</option>
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
              {editingSubject ? 'Update Subject' : 'Save Subject to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmSubject && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmSubject(null)}
          title="Confirm Subject Deactivation"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to deactivate <strong style={{ color: '#0f172a' }}>"{deleteConfirmSubject.name}" ({deleteConfirmSubject.code})</strong>?
              Historical timetable and marks records will remain intact.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmSubject(null)}
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
                Yes, Deactivate Subject
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminSubjectsPage;
