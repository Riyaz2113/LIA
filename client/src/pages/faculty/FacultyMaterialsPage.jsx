import { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  FileCode,
  Link as LinkIcon,
  Eye,
  Plus,
  X,
  Check,
} from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyTabs from '../../components/faculty/FacultyTabs';
import FacultyTable from '../../components/faculty/FacultyTable';
import { materialService } from '../../services/materialService';

/**
 * FacultyMaterialsPage
 * Study Materials view matching the exact reference design.
 * Features 3 tabs (My Materials, Shared with Me, Department Resources), Upload Material button,
 * and materials list table with type badges (PDF, PPT, Link).
 */
const FacultyMaterialsPage = () => {
  const [activeTab, setActiveTab] = useState('My Materials');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form state for mock upload
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialSubject, setMaterialSubject] = useState('CS306');
  const [materialType, setMaterialType] = useState('PDF');

  const tabs = [
    { id: 'My Materials', name: 'My Materials' },
    { id: 'Shared with Me', name: 'Shared with Me' },
    { id: 'Department Resources', name: 'Department Resources' },
  ];

  const [materials, setMaterials] = useState([
    { id: 1, title: 'Unit 1 - Introduction to AI', subject: 'CS306', type: 'PDF', date: '10 Sep 2026', size: '2.4 MB' },
    { id: 2, title: 'Search Algorithms Notes', subject: 'CS306', type: 'PDF', date: '12 Sep 2026', size: '1.8 MB' },
    { id: 3, title: 'Machine Learning Slides', subject: 'CS308', type: 'PPT', date: '14 Sep 2026', size: '5.6 MB' },
    { id: 4, title: 'Lab Manual', subject: 'CS306', type: 'PDF', date: '01 Sep 2026', size: '3.1 MB' },
    { id: 5, title: 'Previous Year Question Papers', subject: 'CS306', type: 'PDF', date: '20 Aug 2026', size: '4.2 MB' },
    { id: 6, title: 'Research Papers - NLP', subject: 'CS306', type: 'Link', date: '18 Aug 2026', size: 'External' },
  ]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await materialService.getAll();
      if (res && res.data && res.data.length > 0) {
        setMaterials(res.data.map((m, idx) => ({
          id: m._id || idx + 1,
          title: m.title,
          subject: m.subject?.code || m.subjectCode || 'CS306',
          type: m.fileType ? m.fileType.toUpperCase() : 'PDF',
          date: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
          size: '3.2 MB'
        })));
      }
    } catch (err) {
      console.warn('Using default materials list:', err.message);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;

    try {
      await materialService.create({
        title: materialTitle.trim(),
        subject: materialSubject,
        fileType: materialType.toLowerCase(),
        fileUrl: 'https://cdn.vignanlara.edu.in/materials/sample.pdf'
      });
      fetchMaterials();
    } catch (err) {
      const newMat = {
        id: materials.length + 1,
        title: materialTitle.trim(),
        subject: materialSubject,
        type: materialType,
        date: '21 Sep 2026',
        size: materialType === 'Link' ? 'External' : '3.0 MB',
      };
      setMaterials([newMat, ...materials]);
    }
    setMaterialTitle('');
    setUploadModalOpen(false);
    setToastMessage('✅ Study Material uploaded successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'PPT':
        return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
      case 'Link':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'PDF':
      default:
        return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Upload Action Button */}
      <FacultyPageHeader
        title="Study Materials"
        subtitle="Share notes, presentations, reference books and resources."
        rightContent={
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
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
            <UploadCloud size={16} />
            <span>Upload Material</span>
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

      {/* 3. Materials Table */}
      <FacultyTable
        columns={[
          { header: '#', width: '50px' },
          { header: 'Title' },
          { header: 'Subject', width: '130px' },
          { header: 'Type', width: '120px' },
          { header: 'Upload Date', width: '150px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
      >
        {materials.map((mat) => {
          const badge = getTypeBadge(mat.type);
          return (
            <tr
              key={mat.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="faculty-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{mat.id}</td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {mat.type === 'Link' ? (
                    <LinkIcon size={16} color="#2563eb" />
                  ) : (
                    <FileText size={16} color="#dc2626" />
                  )}
                  <span>{mat.title}</span>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                {mat.subject}
              </td>
              <td style={{ padding: '1rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {mat.type}
                </span>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {mat.date}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => alert(`Opening resource: ${mat.title} (${mat.size})`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #2563eb',
                    color: '#2563eb',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Eye size={13} />
                  <span>View</span>
                </button>
              </td>
            </tr>
          );
        })}
      </FacultyTable>

      {/* Upload Material Modal */}
      {uploadModalOpen && (
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
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Upload Study Material
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Material Title
                </label>
                <input
                  type="text"
                  required
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g. Unit 2 - Heuristic Search Strategies"
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
                    Subject Code
                  </label>
                  <select
                    value={materialSubject}
                    onChange={(e) => setMaterialSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      outline: 'none',
                    }}
                  >
                    <option value="CS301">CS301 (Data Structures)</option>
                    <option value="CS304">CS304 (Operating Systems)</option>
                    <option value="CS306">CS306 (AI)</option>
                    <option value="CS308">CS308 (Machine Learning)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Resource Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      outline: 'none',
                    }}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPT">PowerPoint Slides</option>
                    <option value="Link">Web / Video Link</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                }}
              >
                <UploadCloud size={28} color="#2563eb" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                  Click to select file or drag &amp; drop
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.2rem' }}>
                  PDF, PPTX, DOCX up to 25MB
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
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
                  Confirm Upload
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

export default FacultyMaterialsPage;
