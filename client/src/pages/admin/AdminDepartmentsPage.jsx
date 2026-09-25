import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import departmentService from '../../services/departmentService';

/**
 * AdminDepartmentsPage
 * Atlas-backed Academic Departments CMS.
 */
const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteConfirmDept, setDeleteConfirmDept] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getAll();
      if (res && res.data) {
        const mapped = res.data.map((d) => ({
          id: d._id || d.id,
          code: d.code,
          name: d.name,
          description: d.description || '',
          hod: d.hod?.name || 'Assigned HOD',
          facultyCount: d.facultyCount || 0,
          studentCount: d.studentCount || 0,
          status: d.isActive !== false ? 'Active' : 'Inactive',
        }));
        setDepartments(mapped);
      }
    } catch {
      showToast('Error loading departments from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({ code: '', name: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDept(d);
    setFormData({
      code: d.code,
      name: d.name,
      description: d.description || '',
    });
    setModalOpen(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
      };

      if (editingDept && editingDept.id) {
        await departmentService.update(editingDept.id, payload);
        showToast(`Department ${formData.code.toUpperCase()} updated in Atlas.`);
      } else {
        await departmentService.create(payload);
        showToast(`Department ${formData.code.toUpperCase()} created in Atlas!`);
      }
      await loadDepartments();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save department.', 'error');
    }
  };

  const confirmDeactivate = async () => {
    if (!deleteConfirmDept) return;
    try {
      await departmentService.delete(deleteConfirmDept.id);
      showToast(`Department ${deleteConfirmDept.code} deactivated.`);
      await loadDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to deactivate department.', 'error');
    } finally {
      setDeleteConfirmDept(null);
    }
  };

  const filteredDepts = departments.filter((d) => {
    if (
      searchQuery &&
      !d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.hod.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Departments CMS"
        subtitle="Manage institute departments, faculty counts and student enrollment."
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
            <span>Add Department</span>
          </button>
        }
      />

      {/* 2. Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search department name, code, or HOD..."
      />

      {/* 3. Table */}
      <AdminTable
        columns={[
          { header: 'Dept Code', width: '120px' },
          { header: 'Department Name' },
          { header: 'Head of Department (HOD)', width: '220px' },
          { header: 'Faculty', width: '110px' },
          { header: 'Students', width: '110px' },
          { header: 'Status', width: '120px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredDepts.length > 0 ? 1 : 0,
          endEntry: filteredDepts.length,
          totalEntries: filteredDepts.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading departments from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredDepts.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No departments found.
            </td>
          </tr>
        ) : (
          filteredDepts.map((d) => (
            <tr
              key={d.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="admin-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 800, color: '#2563eb' }}>
                {d.code}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {d.name}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#334155', fontWeight: 600 }}>
                {d.hod}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {d.facultyCount}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {d.studentCount}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={d.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(d)}
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
                    onClick={() => setDeleteConfirmDept(d)}
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

      {/* Add / Edit Department Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? 'Edit Academic Department' : 'Add Academic Department'}
      >
        <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Dept Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. IT"
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
                Department Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Information Technology"
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
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Department profile & objectives..."
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
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
              {editingDept ? 'Update Department' : 'Create Department'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Deactivate */}
      {deleteConfirmDept && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmDept(null)}
          title="Confirm Department Archive"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to deactivate <strong style={{ color: '#0f172a' }}>"{deleteConfirmDept.name}" ({deleteConfirmDept.code})</strong>?
              Active records referencing this department will be safely preserved.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmDept(null)}
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
                onClick={confirmDeactivate}
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
                Yes, Deactivate
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminDepartmentsPage;
