import { useState, useEffect } from 'react';
import { Plus, Eye, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import studentService from '../../services/studentService';

/**
 * AdminStudentsPage
 * Atlas-backed Student Directory & Admissions Management CMS.
 */
const AdminStudentsPage = () => {
  const [programFilter, setProgramFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAll();
      if (res && res.data) {
        const mapped = res.data.map((st, idx) => ({
          id: st._id || idx + 1,
          rollNumber: st.rollNumber || `23VL1A050${idx + 1}`,
          name: st.user?.name || 'Student',
          email: st.user?.email || 'student@vignanlara.ac.in',
          phone: st.user?.phone || '',
          department: st.department?.code || 'CSE',
          deptName: st.department?.name || 'Computer Science',
          program: st.department?.code ? `B.Tech ${st.department.code}` : 'B.Tech CSE',
          year: st.year || 3,
          semester: st.semester || 1,
          section: st.section || 'A',
          admissionYear: st.admissionYear || 2024,
          status: st.user?.isActive !== false ? 'Submitted' : 'Inactive',
        }));
        setStudents(mapped);
      }
    } catch {
      showToast('Error loading student records from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: 'CSE',
    year: 1,
    semester: 1,
    section: 'A',
    phone: '',
  });

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      rollNumber: '',
      department: 'CSE',
      year: 1,
      semester: 1,
      section: 'A',
      phone: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStudent(st);
    setFormData({
      name: st.name,
      email: st.email,
      rollNumber: st.rollNumber,
      department: st.department,
      year: st.year,
      semester: st.semester,
      section: st.section,
      phone: st.phone || '',
    });
    setModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rollNumber) return;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        rollNumber: formData.rollNumber.toUpperCase(),
        department: formData.department,
        year: Number(formData.year),
        semester: Number(formData.semester),
        section: formData.section.toUpperCase(),
        phone: formData.phone,
      };

      if (editingStudent && editingStudent.id) {
        await studentService.update(editingStudent.id, payload);
        showToast(`Student profile ${formData.rollNumber.toUpperCase()} updated in Atlas.`);
      } else {
        await studentService.create(payload);
        showToast(`Student ${formData.name} (${formData.rollNumber.toUpperCase()}) registered in Atlas!`);
      }
      await loadStudents();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save student record.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmStudent) return;
    try {
      await studentService.delete(deleteConfirmStudent.id);
      showToast(`Student record ${deleteConfirmStudent.rollNumber} removed from Atlas.`);
      await loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove student.', 'error');
    } finally {
      setDeleteConfirmStudent(null);
    }
  };

  const filteredApps = students.filter((app) => {
    if (programFilter !== 'All' && app.program !== programFilter && app.department !== programFilter) return false;
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (
      searchQuery &&
      !app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 8px' }}>
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

      {/* 1. Header with Add Student Button */}
      <AdminPageHeader
        title="Student Management"
        subtitle="Manage and track admission applications and enrolled student records."
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
            <span>Add Student</span>
          </button>
        }
      />

      {/* 2. Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, email or roll no..."
        filters={[
          {
            label: 'Program',
            value: programFilter,
            onChange: setProgramFilter,
            options: ['All', 'CSE', 'AIML', 'ECE', 'EEE', 'ME'],
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: ['All', 'Submitted', 'Inactive'],
          },
        ]}
      />

      {/* 3. Table */}
      <AdminTable
        columns={[
          { header: 'Roll Number', width: '150px' },
          { header: 'Student Name' },
          { header: 'Program & Dept', width: '160px' },
          { header: 'Year / Sem', width: '130px' },
          { header: 'Status', width: '120px' },
          { header: 'Actions', width: '120px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredApps.length > 0 ? 1 : 0,
          endEntry: filteredApps.length,
          totalEntries: filteredApps.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading student roster from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredApps.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No student records found.
            </td>
          </tr>
        ) : (
          filteredApps.map((app) => (
            <tr
              key={app.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="admin-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                {app.rollNumber}
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{app.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.email}</div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                {app.program}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                Year {app.year} / Sem {app.semester} ({app.section})
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={app.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    title="View details"
                    onClick={() => setSelectedApp(app)}
                    style={{
                      padding: '0.35rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    type="button"
                    title="Edit student"
                    onClick={() => handleOpenEdit(app)}
                    style={{
                      padding: '0.35rem 0.55rem',
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
                    title="Delete student"
                    onClick={() => setDeleteConfirmStudent(app)}
                    style={{
                      padding: '0.35rem 0.55rem',
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

      {/* Detail Modal */}
      {selectedApp && (
        <AdminModal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          title={`Student Details: ${selectedApp.rollNumber}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Student Name</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{selectedApp.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Roll Number</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#2563eb' }}>{selectedApp.rollNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Department / Program</div>
                <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>{selectedApp.deptName} ({selectedApp.department})</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Academic Standing</div>
                <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>Year {selectedApp.year} - Sem {selectedApp.semester} ({selectedApp.section})</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Institutional Email</div>
                <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>{selectedApp.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</div>
                <div style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: 600 }}>{selectedApp.status}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Add / Edit Student Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStudent ? 'Edit Student Record' : 'Register New Student'}
      >
        <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Roll Number *
              </label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 23VL1A0501"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. 23vl1a0501@vignanlara.ac.in"
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
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
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value={1}>Sem 1</option>
                <option value={2}>Sem 2</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
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
              {editingStudent ? 'Update Student' : 'Save Student to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmStudent && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmStudent(null)}
          title="Confirm Student Deletion"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to delete student <strong style={{ color: '#0f172a' }}>"{deleteConfirmStudent.name}" ({deleteConfirmStudent.rollNumber})</strong>?
              This will deactivate their login account and remove their profile from MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmStudent(null)}
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
                Yes, Delete Student
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminStudentsPage;
