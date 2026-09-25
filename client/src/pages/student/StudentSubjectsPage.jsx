import { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { subjectService } from '../../services/subjectService';
import { timetableService } from '../../services/timetableService';

/**
 * StudentSubjectsPage
 * Implements both Subjects and Timetable views from approved Reference 3 (media_1789841993528.jpg).
 */
const StudentSubjectsPage = () => {
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' | 'timetable'
  const [selectedSemester, setSelectedSemester] = useState('Semester I (2025 - 2026)');
  const [timetableMode, setTimetableMode] = useState('week'); // 'week' | 'day'

  const [subjectList, setSubjectList] = useState([
    { id: 1, code: 'CS301', name: 'Data Structures', type: 'Theory', credits: 4, faculty: 'Dr. R. Mehta' },
    { id: 2, code: 'CS302', name: 'Database Management Systems', type: 'Theory', credits: 4, faculty: 'Dr. S. Rao' },
    { id: 3, code: 'CS303', name: 'Operating Systems', type: 'Theory', credits: 4, faculty: 'Dr. P. Kumar' },
    { id: 4, code: 'CS304', name: 'Software Engineering', type: 'Theory', credits: 3, faculty: 'Dr. K. Sharma' },
    { id: 5, code: 'CS305', name: 'Web Technologies', type: 'Lab', credits: 2, faculty: 'Ms. A. Reddy' },
    { id: 6, code: 'CS306', name: 'Artificial Intelligence', type: 'Theory', credits: 3, faculty: 'Dr. V. Prasad' },
  ]);

  useEffect(() => {
    fetchSubjectsAndTimetable();
  }, []);

  const fetchSubjectsAndTimetable = async () => {
    try {
      const subRes = await subjectService.getAll();
      if (subRes && subRes.data && subRes.data.length > 0) {
        setSubjectList(subRes.data.map((s, idx) => ({
          id: s._id || idx + 1,
          code: s.code || `CS30${idx + 1}`,
          name: s.name,
          type: s.type ? (s.type.charAt(0).toUpperCase() + s.type.slice(1).toLowerCase()) : 'Theory',
          credits: s.credits || 4,
          faculty: s.faculty?.profile?.firstName ? `Dr. ${s.faculty.profile.lastName || s.faculty.profile.firstName}` : 'Dr. R. Mehta'
        })));
      }
    } catch (err) {
      console.warn('Using default subject curriculum:', err.message);
    }
  };

  const subjects = subjectList;

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '01:30 - 02:30',
    '02:30 - 03:30',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timetableData = {
    '09:00 - 10:00': ['CS301', 'CS302', 'CS303', 'CS301', 'CS304', '-'],
    '10:00 - 11:00': ['CS302', 'CS301', 'CS304', 'CS303', 'CS305 (Lab)', '-'],
    '11:15 - 12:15': ['CS303', 'CS304', 'CS302', 'CS305 (Lab)', '-', '-'],
    '01:30 - 02:30': ['CS304', 'CS303', '-', 'CS302', 'CS306', '-'],
    '02:30 - 03:30': ['CS305 (Lab)', '-', 'CS306', '-', '-', '-'],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with View Toggle & Semester Selector */}
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
            {activeTab === 'subjects' ? 'Subjects' : 'Timetable'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {activeTab === 'subjects'
              ? 'View your current semester subjects and details.'
              : 'Plan your day and stay organized.'}
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
              onClick={() => setActiveTab('subjects')}
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
                backgroundColor: activeTab === 'subjects' ? '#2563eb' : 'transparent',
                color: activeTab === 'subjects' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              <BookOpen size={14} />
              <span>Subjects</span>
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
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
                backgroundColor: activeTab === 'timetable' ? '#2563eb' : 'transparent',
                color: activeTab === 'timetable' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              <Calendar size={14} />
              <span>Timetable</span>
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
              <option value="Semester II (2025 - 2026)">Semester II (2025 - 2026)</option>
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

          {/* Week / Day View Toggle (Only in Timetable) */}
          {activeTab === 'timetable' && (
            <div
              style={{
                display: 'flex',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.2rem',
              }}
            >
              <button
                onClick={() => setTimetableMode('week')}
                style={{
                  border: 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: timetableMode === 'week' ? '#2563eb' : 'transparent',
                  color: timetableMode === 'week' ? '#ffffff' : '#64748b',
                }}
              >
                Week View
              </button>
              <button
                onClick={() => setTimetableMode('day')}
                style={{
                  border: 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: timetableMode === 'day' ? '#2563eb' : 'transparent',
                  color: timetableMode === 'day' ? '#ffffff' : '#64748b',
                }}
              >
                Day View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Canvas */}
      {activeTab === 'subjects' ? (
        /* ── SUBJECTS TABLE VIEW ────────────────────────────── */
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
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Type</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Credits</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Faculty</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Syllabus</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{s.id}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 700 }}>{s.code}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: s.type === 'Theory' ? '#eff6ff' : '#fdf4ff',
                          color: s.type === 'Theory' ? '#2563eb' : '#c026d3',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                        }}
                      >
                        {s.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 700 }}>{s.credits}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 500 }}>{s.faculty}</td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <button
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#2563eb',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <FileText size={13} />
                        <span>Syllabus PDF</span>
                        <Download size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── TIMETABLE MATRIX VIEW ──────────────────────────── */
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0f172a', textAlign: 'left' }}>
                    Time
                  </th>
                  {days.map((day, idx) => (
                    <th key={idx} style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, sIdx) => (
                  <tr key={sIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td
                      style={{
                        padding: '1rem',
                        fontWeight: 700,
                        color: '#475569',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {slot}
                    </td>
                    {timetableData[slot].map((item, dIdx) => (
                      <td key={dIdx} style={{ padding: '0.75rem 0.5rem' }}>
                        {item !== '-' ? (
                          <div
                            style={{
                              backgroundColor: item.includes('Lab') ? '#fdf2f8' : '#eff6ff',
                              border: `1px solid ${item.includes('Lab') ? '#fbcfe8' : '#dbeafe'}`,
                              color: item.includes('Lab') ? '#be185d' : '#1e40af',
                              borderRadius: '8px',
                              padding: '0.5rem 0.25rem',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                            }}
                          >
                            {item}
                          </div>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>&mdash;</span>
                        )}
                      </td>
                    ))}
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
            {activeTab === 'subjects' ? <BookOpen size={24} /> : <Clock size={24} />}
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
              {activeTab === 'subjects'
                ? 'Knowledge today, better opportunities tomorrow.'
                : 'Discipline turns goals into achievements.'}
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb' }}>
              {activeTab === 'subjects' ? 'Keep Learning!' : 'Make the most of your time!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubjectsPage;
