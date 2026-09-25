import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import facultyService from '../../services/facultyService';

/**
 * AdminFacultyPage
 * Atlas-backed Faculty Management CMS with full profile CRUD and RBAC synchronization.
 */
const AdminFacultyPage = () => {
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [deleteConfirmFaculty, setDeleteConfirmFaculty] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const res = await facultyService.getAll();
      if (res && res.data) {
        const mapped = res.data.map((f) => ({
          id: f._id || f.id,
          facultyId: f.employeeId || 'VLIT/FAC/1000',
          name: f.user?.name || 'Faculty Member',
          department: f.department?.name || 'Computer Science',
          deptCode: f.department?.code || 'CSE',
          designation: f.designation || 'Assistant Professor',
          email: f.user?.email || 'faculty@vignanlara.ac.in',
          subjects: f.specialization || 'Curriculum',
          status: f.user?.isActive !== false ? 'Active' : 'Inactive',
        }));
        setFacultyList(mapped);
      }
    } catch {
      showToast('Error loading faculty list from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    department: 'CSE',
    designation: 'Assistant Professor',
    email: '',
    subjects: '',
  });

  const handleOpenCreate = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      facultyId: '',
      department: 'CSE',
      designation: 'Assistant Professor',
      email: '',
      subjects: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFaculty(f);
    setFormData({
      name: f.name,
      facultyId: f.facultyId,
      department: f.deptCode || 'CSE',
      designation: f.designation,
      email: f.email,
      subjects: f.subjects,
    });
    setModalOpen(true);
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.facultyId) return;

    try {
      const payload = {
        name: formData.name,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@vignanlara.ac.in`,
        employeeId: formData.facultyId,
        department: formData.department,
        designation: formData.designation,
        specialization: formData.subjects,
      };

      if (editingFaculty && editingFaculty.id) {
        await facultyService.update(editingFaculty.id, payload);
        showToast(`Faculty profile for ${formData.name} updated in Atlas.`);
      } else {
        await facultyService.create(payload);
        showToast(`Faculty profile for ${formData.name} registered in Atlas!`);
      }
      await loadFaculty();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save faculty profile.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmFaculty) return;
    try {
      await facultyService.delete(deleteConfirmFaculty.id);
      showToast(`Faculty profile ${deleteConfirmFaculty.facultyId} removed from Atlas.`);
      await loadFaculty();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove faculty member.', 'error');
    } finally {
      setDeleteConfirmFaculty(null);
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    if (deptFilter !== 'All' && !f.department.toLowerCase().includes(deptFilter.toLowerCase()) && !f.deptCode?.toLowerCase().includes(deptFilter.toLowerCase())) return false;
    if (statusFilter !== 'All' && f.status !== statusFilter) return false;
    if (
      searchQuery &&
      !f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.facultyId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !f.email.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* 1. Header */}
      <AdminPageHeader
        title="Faculty Management"
        subtitle="Manage teaching staff profiles, designations and subject allotments."
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
            <span>Add Faculty</span>
          </button>
        }
      />

      {/* 2. Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search faculty name, ID, email..."
        filters={[
          {
            label: 'Department',
            value: deptFilter,
            onChange: setDeptFilter,
            options: ['All', 'CSE', 'AIML', 'ECE', 'EEE', 'ME'],
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: ['All', 'Active', 'Inactive'],
          },
        ]}
      />

      {/* 3. Table */}
      <AdminTable
        columns={[
          { header: 'Faculty ID', width: '160px' },
          { header: 'Faculty Member' },
          { header: 'Department', width: '160px' },
          { header: 'Designation', width: '170px' },
          { header: 'Specialization', width: '150px' },
          { header: 'Status', width: '120px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredFaculty.length > 0 ? 1 : 0,
          endEntry: filteredFaculty.length,
          totalEntries: filteredFaculty.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading faculty profiles from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredFaculty.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No faculty members found matching filters.
            </td>
          </tr>
        ) : (
          filteredFaculty.map((f) => (
            <tr
              key={f.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="admin-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                {f.facultyId}
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{f.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.email}</div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {f.department}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                {f.designation}
              </td>
              <td style={{ padding: '1rem' }}>
                <span
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {f.subjects}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={f.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(f)}
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
                    onClick={() => setDeleteConfirmFaculty(f)}
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

      {/* Add / Edit Faculty Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty Member' : 'Register Faculty Member'}
      >
        <form onSubmit={handleSaveFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Faculty Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. R. Mehta"
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
                Faculty Employee ID *
              </label>
              <input
                type="text"
                required
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                placeholder="e.g. VLIT/CSE/1046"
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
              Institutional Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. rmehta@vignanlara.ac.in"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <option value="CSE">CSE (Computer Science)</option>
                <option value="AIML">AIML (AI &amp; ML)</option>
                <option value="ECE">ECE (Electronics)</option>
                <option value="EEE">EEE (Electrical)</option>
                <option value="ME">ME (Mechanical)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor & HOD">Professor &amp; HOD</option>
                <option value="Professor">Professor</option>
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
              {editingFaculty ? 'Update Faculty' : 'Save Faculty to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmFaculty && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmFaculty(null)}
          title="Confirm Faculty Removal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to remove faculty member <strong style={{ color: '#0f172a' }}>"{deleteConfirmFaculty.name}" ({deleteConfirmFaculty.facultyId})</strong>?
              This will deactivate their linked login account and remove their profile from MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmFaculty(null)}
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
                Yes, Delete Faculty
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminFacultyPage;
