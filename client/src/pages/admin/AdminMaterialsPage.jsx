import { useState, useEffect } from 'react';
import { Plus, FileText, Download, Trash2, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { materialService } from '../../services/materialService';

/**
 * AdminMaterialsPage
 * Atlas-backed Study Materials and Lecture Resources CMS.
 */
const AdminMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deleteConfirmMaterial, setDeleteConfirmMaterial] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await materialService.getAll({ includeUnpublished: 'true' });
      if (res && res.data) {
        setMaterials(
          res.data.map((m) => ({
            id: m._id || m.id,
            title: m.title,
            subject: m.subject?.name || m.subject?.code || 'Computer Science',
            subjectCode: m.subject?.code || 'CS301',
            department: m.subject?.department?.code || m.classSection?.department?.code || 'CSE',
            type: m.fileType ? `${m.fileType.toUpperCase()} Document` : 'PDF Document',
            category: m.category || 'NOTES',
            uploadedBy: m.faculty?.user?.name || 'Dr. R. Mehta',
            uploadDate: m.createdAt
              ? new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Recent',
            status: m.isPublished !== false ? 'Published' : 'Draft',
            fileUrl: m.fileUrl || 'https://cdn.vignanlara.edu.in/materials/handout.pdf',
          }))
        );
      }
    } catch (err) {
      showToast('Error loading study materials from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    subject: 'CS301',
    category: 'NOTES',
    fileType: 'PDF',
    fileUrl: 'https://cdn.vignanlara.edu.in/materials/handout.pdf',
    status: 'Published',
  });

  const handleOpenCreate = () => {
    setEditingMaterial(null);
    setFormData({
      title: '',
      subject: 'CS301',
      category: 'NOTES',
      fileType: 'PDF',
      fileUrl: 'https://cdn.vignanlara.edu.in/materials/handout.pdf',
      status: 'Published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMaterial(m);
    setFormData({
      title: m.title,
      subject: m.subjectCode || m.subject,
      category: m.category || 'NOTES',
      fileType: m.type.replace(' Document', '').trim() || 'PDF',
      fileUrl: m.fileUrl,
      status: m.status,
    });
    setModalOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) return;

    try {
      const payload = {
        title: formData.title,
        subject: formData.subject,
        category: formData.category.toUpperCase(),
        fileType: formData.fileType.toUpperCase(),
        fileUrl: formData.fileUrl,
        isPublished: formData.status === 'Published',
      };

      if (editingMaterial && editingMaterial.id) {
        await materialService.update(editingMaterial.id, payload);
        showToast(`Study material "${formData.title}" updated in Atlas.`);
      } else {
        await materialService.create(payload);
        showToast(`Study material "${formData.title}" uploaded to Atlas!`);
      }
      await fetchMaterials();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save study material.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmMaterial) return;
    try {
      await materialService.delete(deleteConfirmMaterial.id);
      showToast('Material removed from Atlas.');
      await fetchMaterials();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete material.', 'error');
    } finally {
      setDeleteConfirmMaterial(null);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    if (deptFilter !== 'All' && m.department !== deptFilter) return false;
    if (
      searchQuery &&
      !m.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Study Materials & Resources CMS"
        description="Oversee faculty lecture handouts, lab manuals, and syllabus resources across all academic programs."
        breadcrumbs={[
          { label: 'Academics', path: '/admin/academics' },
          { label: 'Materials' },
        ]}
        actionLabel="Upload Material"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search materials by title, subject or faculty..."
        filters={[
          {
            label: 'Department',
            value: deptFilter,
            onChange: setDeptFilter,
            options: ['All', 'CSE', 'AIML', 'ECE', 'EEE', 'ME', 'Civil'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Resource Title' },
          { header: 'Subject & Dept', width: '180px' },
          { header: 'Type / Format', width: '150px' },
          { header: 'Uploaded By', width: '160px' },
          { header: 'Status', width: '130px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredMaterials.length > 0 ? 1 : 0,
          endEntry: filteredMaterials.length,
          totalEntries: filteredMaterials.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading study resources from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredMaterials.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No study materials found.
            </td>
          </tr>
        ) : (
          filteredMaterials.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.uploadDate}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{m.subject}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.department}</div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {m.type}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#0f172a' }}>
                {m.uploadedBy}
              </td>
              <td style={{ padding: '1rem' }}>
                <AdminStatusBadge status={m.status} />
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(m)}
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
                    onClick={() => setDeleteConfirmMaterial(m)}
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

      {/* Modal for Upload / Edit Material */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMaterial ? 'Edit Study Material' : 'Upload Academic Resource'}
      >
        <form onSubmit={handleSaveMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Unit 3 — Graph Algorithms & Shortest Path"
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
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. CS301"
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
                <option value="NOTES">Notes & Handouts</option>
                <option value="LECTURE">Lecture Slides</option>
                <option value="LAB">Lab Manual</option>
                <option value="QUESTION_PAPER">Question Paper</option>
                <option value="REFERENCE">Reference Material</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Format
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
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
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="PPTX">PPTX</option>
                <option value="ZIP">ZIP</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Document Remote URL *
              </label>
              <input
                type="url"
                required
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://cdn.vignanlara.edu.in/..."
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
              {editingMaterial ? 'Update Resource' : 'Save Material to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmMaterial && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmMaterial(null)}
          title="Confirm Material Deletion"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: '#0f172a' }}>"{deleteConfirmMaterial.title}"</strong>?
              This will permanently remove the resource reference from MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmMaterial(null)}
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
                Yes, Delete Material
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminMaterialsPage;
