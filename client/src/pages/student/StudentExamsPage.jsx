import { useState } from 'react';
import {
  Calendar,
  Award,
  ChevronDown,
  Clock,
  MapPin,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

/**
 * StudentExamsPage
 * Recreated faithfully from approved Reference 4 (media_1789841993528.jpg).
 */
const StudentExamsPage = () => {
  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'upcoming'
  const [selectedSemester, setSelectedSemester] = useState('Semester I (2025 - 2026)');

  const results = [
    {
      id: 1,
      code: 'CS301',
      name: 'Data Structures',
      int1: 26,
      int2: 24,
      endSem: 34,
      total: 84,
      grade: 'A',
      gradeType: 'good',
    },
    {
      id: 2,
      code: 'CS302',
      name: 'Database Management Systems',
      int1: 23,
      int2: 25,
      endSem: 32,
      total: 80,
      grade: 'A',
      gradeType: 'good',
    },
    {
      id: 3,
      code: 'CS303',
      name: 'Operating Systems',
      int1: 28,
      int2: 27,
      endSem: 36,
      total: 91,
      grade: 'O',
      gradeType: 'outstanding',
    },
    {
      id: 4,
      code: 'CS304',
      name: 'Software Engineering',
      int1: 22,
      int2: 24,
      endSem: 30,
      total: 76,
      grade: 'B+',
      gradeType: 'average',
    },
    {
      id: 5,
      code: 'CS305',
      name: 'Web Technologies',
      int1: 27,
      int2: 26,
      endSem: 33,
      total: 86,
      grade: 'A',
      gradeType: 'good',
    },
    {
      id: 6,
      code: 'CS306',
      name: 'Artificial Intelligence',
      int1: 25,
      int2: 28,
      endSem: 35,
      total: 88,
      grade: 'A',
      gradeType: 'good',
    },
  ];

  const upcomingExams = [
    {
      id: 1,
      code: 'CS301',
      name: 'Data Structures (Mid Term II)',
      date: 'Oct 05, 2026',
      time: '10:00 AM - 12:00 PM',
      type: 'Descriptive',
      venue: 'Exam Hall 102',
      status: 'Admit Card Ready',
    },
    {
      id: 2,
      code: 'CS302',
      name: 'Database Management Systems',
      date: 'Oct 07, 2026',
      time: '10:00 AM - 12:00 PM',
      type: 'Descriptive',
      venue: 'Exam Hall 102',
      status: 'Admit Card Ready',
    },
    {
      id: 3,
      code: 'CS303',
      name: 'Operating Systems',
      date: 'Oct 09, 2026',
      time: '10:00 AM - 12:00 PM',
      type: 'Descriptive',
      venue: 'Exam Hall 104',
      status: 'Admit Card Ready',
    },
    {
      id: 4,
      code: 'CS304',
      name: 'Software Engineering',
      date: 'Oct 12, 2026',
      time: '10:00 AM - 12:00 PM',
      type: 'Descriptive',
      venue: 'Exam Hall 104',
      status: 'Upcoming',
    },
    {
      id: 5,
      code: 'CS305',
      name: 'Web Technologies Practical',
      date: 'Oct 15, 2026',
      time: '01:30 PM - 04:30 PM',
      type: 'Lab Exam',
      venue: 'CSE Lab 3',
      status: 'Upcoming',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Tabs and Semester Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.25rem 0',
            }}
          >
            Exams &amp; Results
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            View your exam schedules and results.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          {/* Main Tab Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              padding: '0.25rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'upcoming' ? '#2563eb' : 'transparent',
                color: activeTab === 'upcoming' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              <Calendar size={14} />
              <span>Upcoming Exams</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'results' ? '#2563eb' : 'transparent',
                color: activeTab === 'results' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              <Award size={14} />
              <span>Results</span>
            </button>
          </div>

          {/* Semester Selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                appearance: 'none',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem 2.25rem 0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="Semester I (2025 - 2026)">Semester I (2025 - 2026)</option>
              <option value="Semester II (2024 - 2025)">Semester II (2024 - 2025)</option>
            </select>
            <ChevronDown
              size={14}
              color="#64748b"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Content View */}
      {activeTab === 'results' ? (
        /* ── RESULTS TABLE VIEW ─────────────────────────────── */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>#</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Subject Code</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Subject Name</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Internal 1 (30)</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Internal 2 (30)</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>End Sem (40)</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Total (100)</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{r.id}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 700 }}>{r.code}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 600 }}>{r.name}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569', textAlign: 'center' }}>{r.int1}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569', textAlign: 'center' }}>{r.int2}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569', textAlign: 'center' }}>{r.endSem}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 800, textAlign: 'center' }}>
                      {r.total}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor:
                            r.gradeType === 'outstanding'
                              ? '#ecfdf5'
                              : r.gradeType === 'good'
                              ? '#f0fdf4'
                              : '#fff7ed',
                          color:
                            r.gradeType === 'outstanding'
                              ? '#059669'
                              : r.gradeType === 'good'
                              ? '#16a34a'
                              : '#ea580c',
                          border: `1px solid ${
                            r.gradeType === 'outstanding'
                              ? '#a7f3d0'
                              : r.gradeType === 'good'
                              ? '#bbf7d0'
                              : '#fed7aa'
                          }`,
                        }}
                      >
                        {r.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── UPCOMING EXAMS SCHEDULE VIEW ───────────────────── */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>#</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Code</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Date &amp; Time</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Type</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Venue</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingExams.map((ex) => (
                  <tr
                    key={ex.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{ex.id}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 700 }}>{ex.code}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 600 }}>{ex.name}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 600 }}>
                      <div>{ex.date}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ex.time}</div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                        }}
                      >
                        {ex.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 600 }}>{ex.venue}</td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: ex.status === 'Admit Card Ready' ? '#eff6ff' : '#f8fafc',
                          color: ex.status === 'Admit Card Ready' ? '#2563eb' : '#64748b',
                          border: `1px solid ${ex.status === 'Admit Card Ready' ? '#bfdbfe' : '#e2e8f0'}`,
                        }}
                      >
                        {ex.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Bottom Motivational Banner */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #dbeafe',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
            }}
          >
            <FileCheck size={24} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1e40af',
                lineHeight: 1.2,
              }}
            >
              Every exam is a step closer to your dreams.
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb' }}>
              Keep pushing forward!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExamsPage;
