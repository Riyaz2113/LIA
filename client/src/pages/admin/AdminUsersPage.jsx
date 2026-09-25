import { useState, useEffect } from 'react';
import { Plus, Edit3, Shield, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import userService from '../../services/userService';

/**
 * AdminUsersPage
 * Atlas-backed User Accounts & RBAC Directory CMS.
 */
const AdminUsersPage = () => {
  const [activeTab, setActiveTab] = useState('All Users');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch users from Atlas
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll({
        role: activeTab === 'All Users' ? roleFilter : activeTab,
        status: statusFilter,
      });
      if (res && res.data) {
        const mapped = res.data.map((u) => ({
          id: u._id || u.id,
          name: u.name,
          email: u.email,
          role: u.role === 'ADMIN' ? 'Super Admin' : u.role === 'FACULTY' ? 'Faculty' : u.role === 'STUDENT' ? 'Student' : u.role,
          rawRole: u.role,
          department: u.department || 'Campus',
          status: u.isActive !== false ? 'Active' : 'Inactive',
          isActive: u.isActive !== false,
          lastLogin: 'Active',
        }));
        setUsers(mapped);
      }
    } catch {
      showToast('Error loading user accounts from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeTab, roleFilter, statusFilter]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Faculty',
    status: 'Active',
  });

  const tabs = [
    { id: 'All Users', name: 'All Users' },
    { id: 'Admins', name: 'Admins' },
    { id: 'Faculty', name: 'Faculty' },
    { id: 'Staff', name: 'Staff' },
  ];

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Faculty',
      status: 'Active',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    try {
      const normalizedRole = formData.role === 'Super Admin' ? 'ADMIN' : formData.role.toUpperCase();
      const payload = {
        name: formData.name,
        email: formData.email,
        role: normalizedRole,
        isActive: formData.status === 'Active',
      };

      if (editingUser && editingUser.id) {
        await userService.update(editingUser.id, payload);
        showToast(`User account ${formData.name} updated in Atlas.`);
      } else {
        await userService.create(payload);
        showToast(`User account ${formData.name} created successfully!`);
      }
      await loadUsers();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save user account.', 'error');
    }
  };

  const confirmDeactivate = async () => {
    if (!deleteConfirmUser) return;
    try {
      await userService.delete(deleteConfirmUser.id);
      showToast(`User ${deleteConfirmUser.name} deactivated in Atlas.`);
      await loadUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to deactivate user.', 'error');
    } finally {
      setDeleteConfirmUser(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'Admins' && !u.role.includes('Admin')) return false;
    if (activeTab === 'Faculty' && u.role !== 'Faculty') return false;
    if (activeTab === 'Staff' && u.role !== 'Staff') return false;
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (statusFilter !== 'All' && u.status !== statusFilter) return false;
    if (
      searchQuery &&
      !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* 1. Header with + Add User Button */}
      <AdminPageHeader
        title="Users Management"
        subtitle="Manage administrator, faculty, staff, and student accounts."
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
            <span>Add User</span>
          </button>
        }
      />

      {/* 2. Tabs */}
      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Filters */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name or email..."
        filters={[
          {
            label: 'Role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: ['All', 'Super Admin', 'Faculty', 'Staff', 'Student'],
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: ['All', 'Active', 'Inactive'],
          },
        ]}
      />

      {/* 4. Table */}
      <AdminTable
        columns={[
          { header: 'User Account' },
          { header: 'Email', width: '240px' },
          { header: 'Role', width: '140px' },
          { header: 'Status', width: '120px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredUsers.length > 0 ? 1 : 0,
          endEntry: filteredUsers.length,
          totalEntries: filteredUsers.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading user accounts from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredUsers.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No user accounts found matching criteria.
            </td>
          </tr>
        ) : (
          filteredUsers.map((u) => (
            <tr
              key={u.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="admin-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: u.role === 'Super Admin' ? '#0f172a' : '#eff6ff',
                      color: u.role === 'Super Admin' ? '#ffffff' : '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>{u.email}</td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                {u.role}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={u.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(u)}
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
                    onClick={() => setDeleteConfirmUser(u)}
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

      {/* Add / Edit User Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User Account' : 'Create New User Account'}
      >
        <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. K. Srinivas"
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
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. ksrinivas@vignanlara.ac.in"
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
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                <option value="Faculty">Faculty</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
              {editingUser ? 'Save Changes' : 'Save User to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Deactivate */}
      {deleteConfirmUser && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmUser(null)}
          title="Confirm User Account Deactivation"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to deactivate <strong style={{ color: '#0f172a' }}>"{deleteConfirmUser.name}" ({deleteConfirmUser.email})</strong>?
              This user will lose immediate login access across the platform.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
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
                Yes, Deactivate User
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminUsersPage;
