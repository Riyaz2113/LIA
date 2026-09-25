import { useState, useEffect } from 'react';
import { Plus, Edit3, Briefcase, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { placementService } from '../../services/placementService';

/**
 * AdminPlacementsPage
 * Atlas-backed Placement Drives and Recruitment CMS.
 */
const AdminPlacementsPage = () => {
  const [drives, setDrives] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [deleteConfirmDrive, setDeleteConfirmDrive] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await placementService.getAllDrives({ status: statusFilter });
      if (res && res.data) {
        setDrives(
          res.data.map((d) => ({
            id: d._id || d.id,
            company: d.company?.name || d.company || 'Company',
            role: d.jobTitle || d.role || 'Software Engineer',
            date: d.driveDate
              ? new Date(d.driveDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'TBD',
            rawDate: d.driveDate ? new Date(d.driveDate).toISOString().split('T')[0] : '',
            eligibility: d.eligibility || 'B.Tech (All)',
            status: d.status === 'UPCOMING' ? 'Scheduled' : d.status === 'COMPLETED' ? 'Completed' : 'Ongoing',
            rawStatus: d.status || 'UPCOMING',
            package: d.package || '7.0 LPA',
          }))
        );
      }
    } catch (err) {
      showToast('Unable to load placement drives from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [statusFilter]);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: '',
    eligibility: 'B.Tech (All)',
    status: 'Scheduled',
    package: '7.0 LPA',
  });

  const handleOpenCreate = () => {
    setEditingDrive(null);
    setFormData({
      company: '',
      role: '',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eligibility: 'B.Tech (All)',
      status: 'Scheduled',
      package: '7.0 LPA',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      company: drive.company,
      role: drive.role,
      date: drive.rawDate || new Date().toISOString().split('T')[0],
      eligibility: drive.eligibility,
      status: drive.status,
      package: drive.package,
    });
    setModalOpen(true);
  };

  const handleSaveDrive = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    try {
      const payload = {
        company: formData.company,
        jobTitle: formData.role,
        driveDate: formData.date,
        eligibility: formData.eligibility,
        package: formData.package,
        status: formData.status === 'Scheduled' ? 'UPCOMING' : formData.status === 'Completed' ? 'COMPLETED' : 'ONGOING',
      };

      if (editingDrive && editingDrive.id) {
        await placementService.updateDrive(editingDrive.id, payload);
        showToast(`Placement drive for ${formData.company} updated in Atlas.`);
      } else {
        await placementService.createDrive(payload);
        showToast(`Placement drive for ${formData.company} scheduled in Atlas!`);
      }
      await fetchDrives();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save placement drive.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmDrive) return;
    try {
      await placementService.deleteDrive(deleteConfirmDrive.id);
      showToast('Placement drive deleted from Atlas.');
      await fetchDrives();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete placement drive.', 'error');
    } finally {
      setDeleteConfirmDrive(null);
    }
  };

  const filteredDrives = drives.filter((d) => {
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (
      searchQuery &&
      !d.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Placement Drives CMS"
        description="Schedule on-campus and virtual recruitment drives, register partner companies, and track offers."
        breadcrumbs={[
          { label: 'Campus', path: '/admin' },
          { label: 'Placements' },
        ]}
        actionLabel="Schedule Drive"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by company, role or eligibility..."
        filters={[
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: ['All', 'Scheduled', 'Ongoing', 'Completed'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Company & Role' },
          { header: 'Drive Date', width: '150px' },
          { header: 'Eligibility', width: '160px' },
          { header: 'Package', width: '130px' },
          { header: 'Status', width: '130px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredDrives.length > 0 ? 1 : 0,
          endEntry: filteredDrives.length,
          totalEntries: filteredDrives.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading placement drives from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredDrives.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No placement drives found matching criteria.
            </td>
          </tr>
        ) : (
          filteredDrives.map((drive) => (
            <tr key={drive.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {drive.company}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{drive.role}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {drive.date}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                {drive.eligibility}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', fontWeight: 700, color: '#16a34a' }}>
                {drive.package}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={drive.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(drive)}
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
                    onClick={() => setDeleteConfirmDrive(drive)}
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

      {/* Modal for Create / Edit Drive */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDrive ? 'Edit Placement Drive' : 'Schedule Placement Drive'}
      >
        <form onSubmit={handleSaveDrive} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. TCS / Infosys / Google"
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
                Job Role / Profile *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Graduate Engineer Trainee"
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
                Drive Date *
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
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Package / CTC
              </label>
              <input
                type="text"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                placeholder="e.g. 7.5 LPA"
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
                Eligibility
              </label>
              <input
                type="text"
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                placeholder="e.g. B.Tech CSE, AIML, ECE (60%+)"
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
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
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
              {editingDrive ? 'Update Drive' : 'Save Drive to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmDrive && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmDrive(null)}
          title="Confirm Drive Removal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to cancel and remove the placement drive for{' '}
              <strong style={{ color: '#0f172a' }}>{deleteConfirmDrive.company} ({deleteConfirmDrive.role})</strong>?
              This will permanently remove the drive from MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmDrive(null)}
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
                Yes, Delete Drive
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminPlacementsPage;
