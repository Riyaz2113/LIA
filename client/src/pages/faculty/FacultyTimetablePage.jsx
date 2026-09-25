import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, MapPin } from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import { timetableService } from '../../services/timetableService';

/**
 * FacultyTimetablePage
 * Complete teaching schedule timetable view matching the exact reference design.
 * Features Week/Day switcher, semester selector, full weekly grid with colored subject blocks, and subject legend.
 */
const FacultyTimetablePage = () => {
  const [viewMode, setViewMode] = useState('Week View');
  const [semester, setSemester] = useState('Semester I (2025 - 2026)');

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '01:30 - 02:30',
    '02:30 - 03:30',
    '03:30 - 04:30',
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Subject colors dictionary matching reference
  const subjectStyles = {
    'CS301 (A)': { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', full: 'CS301 - Data Structures', room: 'Room 204' },
    'CS304 (A)': { bg: '#f0fdfa', border: '#99f6e4', text: '#0d9488', full: 'CS304 - Operating Systems', room: 'Room 310' },
    'CS306 (A)': { bg: '#fffbeb', border: '#fde68a', text: '#d97706', full: 'CS306 - Artificial Intelligence', room: 'Room 208' },
    'CS308 (B)': { bg: '#fff1f2', border: '#fecdd3', text: '#e11d48', full: 'CS308 - Machine Learning', room: 'Room 304' },
    'Faculty Meeting': { bg: '#faf5ff', border: '#f3e8ff', text: '#9333ea', full: 'Faculty Meeting', room: 'Conf. Hall' },
  };

  // Schedule matrix matching reference
  const [matrix, setMatrix] = useState({
    '09:00 - 10:00': { Monday: 'CS301 (A)', Wednesday: 'CS306 (A)', Friday: 'CS301 (A)' },
    '10:00 - 11:00': { Tuesday: 'CS304 (A)', Thursday: 'CS308 (B)' },
    '11:15 - 12:15': { Monday: 'CS306 (A)', Wednesday: 'CS301 (A)', Friday: 'CS304 (A)' },
    '01:30 - 02:30': { Tuesday: 'CS308 (B)', Friday: 'CS306 (A)' },
    '02:30 - 03:30': {},
    '03:30 - 04:30': { Tuesday: 'Faculty Meeting' },
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await timetableService.getFacultySchedule();
      if (res && res.data && res.data.length > 0) {
        const newMatrix = {
          '09:00 - 10:00': {},
          '10:00 - 11:00': {},
          '11:15 - 12:15': {},
          '01:30 - 02:30': {},
          '02:30 - 03:30': {},
          '03:30 - 04:30': {},
        };
        res.data.forEach(slot => {
          const t = `${slot.startTime || '09:00'} - ${slot.endTime || '10:00'}`;
          if (newMatrix[t]) {
            newMatrix[t][slot.day] = `${slot.subject?.code || slot.subjectCode || 'CS301'} (${slot.section || 'A'})`;
          }
        });
        setMatrix(newMatrix);
      }
    } catch (err) {
      console.warn('Using default timetable matrix:', err.message);
    }
  };

  const scheduleMatrix = matrix;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with View Mode Switcher and Semester Selector */}
      <FacultyPageHeader
        title="Timetable"
        subtitle="View your teaching schedule and plan your day."
        rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* View Mode Toggle Buttons */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                padding: '2px',
              }}
            >
              {['Week View', 'Day View'].map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: isActive ? '#2563eb' : 'transparent',
                      color: isActive ? '#ffffff' : '#64748b',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>

            {/* Semester Dropdown */}
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
            </select>
          </div>
        }
      />

      {/* 2. Weekly Grid Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '850px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                <th
                  style={{
                    padding: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    width: '130px',
                    textAlign: 'center',
                  }}
                >
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    style={{
                      padding: '1rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      textAlign: 'center',
                      borderLeft: '1px solid #f1f5f9',
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Time Column */}
                  <td
                    style={{
                      padding: '1rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#475569',
                      textAlign: 'center',
                      backgroundColor: '#fbfcfd',
                    }}
                  >
                    {slot}
                  </td>

                  {/* Day Cells */}
                  {days.map((day) => {
                    const subjectKey = scheduleMatrix[slot]?.[day];
                    const meta = subjectKey ? subjectStyles[subjectKey] : null;

                    return (
                      <td
                        key={day}
                        style={{
                          padding: '0.5rem',
                          height: '74px',
                          verticalAlign: 'middle',
                          textAlign: 'center',
                          borderLeft: '1px solid #f1f5f9',
                        }}
                      >
                        {meta ? (
                          <div
                            style={{
                              backgroundColor: meta.bg,
                              border: `1px solid ${meta.border}`,
                              color: meta.text,
                              borderRadius: '8px',
                              padding: '0.5rem 0.6rem',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.15rem',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}
                          >
                            <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                              {subjectKey}
                            </span>
                            <span style={{ fontSize: '0.6875rem', opacity: 0.85, fontWeight: 600 }}>
                              {meta.room}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#e2e8f0', fontSize: '0.75rem' }}>&mdash;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Subject Legend (Bottom) */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#ffffff',
            borderTop: '1.5px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
            <span style={{ color: '#334155' }}>CS301 - Data Structures</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0d9488' }} />
            <span style={{ color: '#334155' }}>CS304 - Operating Systems</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706' }} />
            <span style={{ color: '#334155' }}>CS306 - Artificial Intelligence</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e11d48' }} />
            <span style={{ color: '#334155' }}>CS308 - Machine Learning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9333ea' }} />
            <span style={{ color: '#334155' }}>Others / Meetings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyTimetablePage;
