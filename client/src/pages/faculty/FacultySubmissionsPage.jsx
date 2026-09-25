import { useState } from 'react';
import { Eye, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyFilterBar from '../../components/faculty/FacultyFilterBar';
import FacultyTable from '../../components/faculty/FacultyTable';
import FacultyEmptyState from '../../components/faculty/FacultyEmptyState';

/**
 * FacultySubmissionsPage
 * Student Submissions view matching the exact reference design.
 * Features Subject, Section, and Assessment filters, search bar, and evaluation status badges (Submitted, Graded, Late).
 */
const FacultySubmissionsPage = () => {
  const [subject, setSubject] = useState('CS306 - Artificial Intelligence');
  const [section, setSection] = useState('IV Year - A');
  const [assessment, setAssessment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const submissions = [
    { id: 1, title: 'Assignment 1 - Search Algorithms', student: 'Rahul Kumar', roll: '21BCS101', date: '15 Sep 2026', status: 'Submitted', file: 'Assignment1_Rahul.pdf' },
    { id: 2, title: 'Assignment 1 - Search Algorithms', student: 'Priya Sharma', roll: '21BCS102', date: '15 Sep 2026', status: 'Submitted', file: 'Assignment1_Priya.pdf' },
    { id: 3, title: 'Assignment 1 - Search Algorithms', student: 'Nikhil Varma', roll: '21BCS103', date: '16 Sep 2026', status: 'Late', file: 'Assignment1_Nikhil.pdf' },
    { id: 4, title: 'Mini Project Proposal', student: 'Anjali Reddy', roll: '21BCS104', date: '12 Sep 2026', status: 'Graded', marks: '9.5/10', file: 'Proposal_Anjali.pdf' },
    { id: 5, title: 'Mini Project Proposal', student: 'Karthik Sai', roll: '21BCS105', date: '12 Sep 2026', status: 'Graded', marks: '8.5/10', file: 'Proposal_Karthik.pdf' },
    { id: 6, title: 'Mini Project Proposal', student: 'Sneha R', roll: '21BCS106', date: '13 Sep 2026', status: 'Submitted', file: 'Proposal_Sneha.pdf' },
    { id: 7, title: 'Lab 2 - Python Programming', student: 'Naveen B', roll: '21BCS107', date: '10 Sep 2026', status: 'Submitted', file: 'Lab2_Naveen.py' },
  ];

  const filteredSubmissions = submissions.filter((s) => {
    if (assessment !== 'All' && !s.title.includes(assessment)) return false;
    if (
      searchQuery &&
      !s.student.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.roll.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Graded':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'Late':
        return { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' };
      case 'Submitted':
      default:
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <FacultyPageHeader
        title="Student Submissions"
        subtitle="View and evaluate student assignments and submissions."
      />

      {/* 2. Filter Bar */}
      <FacultyFilterBar
        filters={[
          {
            label: 'Subject',
            value: subject,
            onChange: setSubject,
            minWidth: '220px',
            options: [
              'CS306 - Artificial Intelligence',
              'CS301 - Data Structures',
              'CS304 - Operating Systems',
              'CS308 - Machine Learning',
            ],
          },
          {
            label: 'Section',
            value: section,
            onChange: setSection,
            minWidth: '130px',
            options: ['IV Year - A', 'IV Year - B', 'III Year - A', 'III Year - B'],
          },
          {
            label: 'Assessment',
            value: assessment,
            onChange: setAssessment,
            minWidth: '180px',
            options: ['All', 'Assignment 1', 'Mini Project', 'Lab 2'],
          },
        ]}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by student name or roll no..."
      />

      {/* 3. Submissions Table */}
      {filteredSubmissions.length > 0 ? (
        <FacultyTable
          columns={[
            { header: '#', width: '50px' },
            { header: 'Title' },
            { header: 'Student', width: '180px' },
            { header: 'Submitted On', width: '140px' },
            { header: 'Status', width: '120px' },
            { header: 'Actions', width: '100px', align: 'right' },
          ]}
        >
          {filteredSubmissions.map((sub) => {
            const badge = getStatusBadge(sub.status);
            return (
              <tr
                key={sub.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 150ms ease',
                }}
                className="faculty-table-row"
              >
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{sub.id}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="#2563eb" />
                    <span>{sub.title}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{sub.student}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{sub.roll}</div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                  {sub.date}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {sub.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(sub)}
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
      ) : (
        <FacultyEmptyState
          title="No Submissions Match Your Filter"
          description="Try changing the assessment filter or search keyword."
        />
      )}

      {/* Submission Modal Preview */}
      {selectedSubmission && (
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
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              {selectedSubmission.title}
            </h3>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Student: <strong>{selectedSubmission.student}</strong> ({selectedSubmission.roll}) &bull; Submitted on {selectedSubmission.date}
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#2563eb" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {selectedSubmission.file}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                }}
              >
                Attached PDF
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Grade saved in review queue.');
                  setSelectedSubmission(null);
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Grade Submission
              </button>
            </div>
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

export default FacultySubmissionsPage;
