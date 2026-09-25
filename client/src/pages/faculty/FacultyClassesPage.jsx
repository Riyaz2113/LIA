import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Layers,
  CheckCircle,
  Eye,
  Clock,
  FileCheck,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyStatCard from '../../components/faculty/FacultyStatCard';
import FacultyTable from '../../components/faculty/FacultyTable';
import FacultyChart from '../../components/faculty/FacultyChart';
import { subjectService } from '../../services/subjectService';

/**
 * FacultyClassesPage
 * My Classes view matching the exact reference design.
 * Features semester selector, 4 stat cards, subject list table with action links,
 * Class Analytics grouped bar chart, and Recent Activity feed.
 */
const FacultyClassesPage = () => {
  const [semester, setSemester] = useState('Semester I (2025 - 2026)');

  const [subjectList, setSubjectList] = useState([
    { id: 1, code: 'CS301', name: 'Data Structures', semester: 'III Year', sections: 'A, B', students: 60 },
    { id: 2, code: 'CS304', name: 'Operating Systems', semester: 'III Year', sections: 'A', students: 30 },
    { id: 3, code: 'CS306', name: 'Artificial Intelligence', semester: 'IV Year', sections: 'A', students: 30 },
    { id: 4, code: 'CS308', name: 'Machine Learning', semester: 'IV Year', sections: 'B', students: 30 },
  ]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAll();
      if (res && res.data && res.data.length > 0) {
        setSubjectList(res.data.map(s => ({
          id: s._id || s.id,
          code: s.code,
          name: s.name,
          semester: `Semester ${s.semester || 'VI'}`,
          sections: 'A, B',
          students: 60
        })));
      }
    } catch (err) {
      console.warn('Using default faculty classes list:', err.message);
    }
  };

  const stats = [
    { label: 'Subjects', value: `${subjectList.length}`, icon: BookOpen, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Class Sections', value: '8', icon: Layers, color: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Total Students', value: `${subjectList.length * 30}`, icon: Users, color: '#9333ea', bg: '#faf5ff' },
    { label: 'Avg. Attendance', value: '92%', icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
  ];

  const subjects = subjectList;

  const recentActivity = [
    { id: 1, title: 'Attendance marked for CS301', time: '2 hours ago', icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
    { id: 2, title: 'New submission in CS306', time: '4 hours ago', icon: FileCheck, color: '#2563eb', bg: '#eff6ff' },
    { id: 3, title: 'Material uploaded for CS308', time: '1 day ago', icon: UploadCloud, color: '#9333ea', bg: '#faf5ff' },
    { id: 4, title: 'Marks updated for CS304', time: '2 days ago', icon: FileSpreadsheet, color: '#ea580c', bg: '#fff7ed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Semester Selector */}
      <FacultyPageHeader
        title="My Classes"
        subtitle="View your subjects, students and class details."
        rightContent={
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#0f172a',
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '8px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option>Semester I (2025 - 2026)</option>
            <option>Semester II (2025 - 2026)</option>
            <option>Semester I (2024 - 2025)</option>
          </select>
        }
      />

      {/* 2. Top 4 Statistic Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {stats.map((s, idx) => (
          <FacultyStatCard
            key={idx}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            bg={s.bg}
          />
        ))}
      </div>

      {/* 3. Subjects Table */}
      <FacultyTable
        columns={[
          { header: '#', width: '60px' },
          { header: 'Subject Code', width: '160px' },
          { header: 'Subject Name' },
          { header: 'Semester', width: '130px' },
          { header: 'Sections', width: '120px' },
          { header: 'Students', width: '110px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
      >
        {subjects.map((sub) => (
          <tr
            key={sub.id}
            style={{
              borderBottom: '1px solid #f1f5f9',
              transition: 'background-color 150ms ease',
            }}
            className="faculty-table-row"
          >
            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{sub.id}</td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
              {sub.code}
            </td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
              {sub.name}
            </td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#475569' }}>{sub.semester}</td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#475569' }}>
              <span
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                }}
              >
                {sub.sections}
              </span>
            </td>
            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
              {sub.students}
            </td>
            <td style={{ padding: '1rem', textAlign: 'right' }}>
              <Link
                to="/faculty/attendance"
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
                  textDecoration: 'none',
                }}
              >
                <Eye size={13} />
                <span>View</span>
              </Link>
            </td>
          </tr>
        ))}
      </FacultyTable>

      {/* 4. Bottom Split Grid: Class Analytics Chart (60%) & Recent Activity (40%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
        }}
        className="faculty-classes-bottom-grid"
      >
        {/* Left: Class Analytics Grouped Bar Chart */}
        <div>
          <FacultyChart
            title="Class Analytics"
            data={[
              { subject: 'CS301', total: 60, present: 55, absent: 5 },
              { subject: 'CS304', total: 30, present: 28, absent: 2 },
              { subject: 'CS306', total: 30, present: 27, absent: 3 },
              { subject: 'CS308', total: 30, present: 29, absent: 1 },
            ]}
          />
        </div>

        {/* Right: Recent Activity Feed */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="#2563eb" />
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Recent Activity
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentActivity.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: act.bg,
                      color: act.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      {act.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .faculty-classes-bottom-grid {
            grid-template-columns: 1.4fr 1fr !important;
          }
        }
        .faculty-table-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default FacultyClassesPage;
