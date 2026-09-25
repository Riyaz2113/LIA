import { useState } from 'react';
import { Plus, Edit3, MoreVertical, BookOpen, Layers } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { ADMIN_PROGRAMS_DATA } from '../../data/adminMockData';

/**
 * AdminAcademicsPage
 * Programs & Courses view matching Panel 3 of the approved reference design.
 * Features department and status filters, programs table with student enrollment counts,
 * and "+ Add Program" modal dialog.
 */
const AdminAcademicsPage = () => {
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [programs, setPrograms] = useState(ADMIN_PROGRAMS_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    department: 'Computer Science',
    duration: '4 Years',
    students: 120,
    status: 'Active',
  });

  const filteredPrograms = programs.filter((p) => {
    if (deptFilter !== 'All Departments' && !p.department.includes(deptFilter)) return false;
    if (statusFilter !== 'All Status' && p.status !== statusFilter) return false;
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.department.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleAddProgram = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newProg = {
      id: programs.length + 1,
      name: formData.name,
      department: formData.department,
      duration: formData.duration,
      students: parseInt(formData.students) || 60,
      status: formData.status,
    };

    setPrograms([...programs, newProg]);
    setFormData({ name: '', department: 'Computer Science', duration: '4 Years', students: 120, status: 'Active' });
    setModalOpen(false);
    setToastMessage('✅ Academic program added successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with + Add Program Button */}
      <AdminPageHeader
        title="Programs & Courses"
        subtitle="Manage academic programs offered at the institute."
        rightContent={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
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
            <span>Add Program</span>
          </button>
        }
      />

      {/* 2. Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search programs..."
        filters={[
          {
            value: deptFilter,
            onChange: setDeptFilter,
            options: ['All Departments', 'Computer Science', 'AI & ML', 'Electronics', 'Electrical', 'Mechanical', 'Management'],
          },
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: ['All Status', 'Active', 'Inactive'],
          },
        ]}
      />

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

      {/* 3. Table */}
      <AdminTable
        columns={[
          { header: '#', width: '50px' },
          { header: 'Program Name' },
          { header: 'Department', width: '200px' },
          { header: 'Duration', width: '140px' },
          { header: 'Students', width: '130px' },
          { header: 'Status', width: '120px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 3,
          startEntry: 1,
          endEntry: filteredPrograms.length,
          totalEntries: filteredPrograms.length,
        }}
      >
        {filteredPrograms.map((p) => (
          <tr
            key={p.id}
            style={{
              borderBottom: '1px solid #f1f5f9',
              transition: 'background-color 150ms ease',
            }}
            className="admin-table-row"
          >
            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{p.id}</td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} color="#2563eb" />
                <span>{p.name}</span>
              </div>
            </td>
            <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
              {p.department}
            </td>
            <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
              {p.duration}
            </td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
              {p.students}
            </td>
            <td style={{ padding: '1rem' }}>
              <AdminStatusBadge status={p.status} />
            </td>
            <td style={{ padding: '1rem', textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => alert(`Edit program: ${p.name}`)}
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
                <button
                  type="button"
                  onClick={() => alert(`Options for: ${p.name}`)}
                  style={{
                    padding: '0.35rem 0.45rem',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  <MoreVertical size={13} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {/* Add Program Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Academic Program"
      >
        <form onSubmit={handleAddProgram} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Program Name &amp; Degree
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. B.Tech - Data Science"
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
                  border: '1.5px solid #e2e8f0',
                  outline: 'none',
                }}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="AI & ML">AI &amp; ML</option>
                <option value="Electronics">Electronics</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1.5px solid #e2e8f0',
                  outline: 'none',
                }}
              >
                <option value="4 Years">4 Years (8 Semesters)</option>
                <option value="2 Years">2 Years (4 Semesters)</option>
                <option value="3 Years">3 Years (6 Semesters)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Student Intake Capacity
            </label>
            <input
              type="number"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: e.target.value })}
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
              Create Program
            </button>
          </div>
        </form>
      </AdminModal>

      <style>{`
        .admin-table-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default AdminAcademicsPage;
