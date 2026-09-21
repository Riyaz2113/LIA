import { useState } from 'react';
import {
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Eye,
  ChevronDown,
  Info,
  Lightbulb,
  Megaphone,
  GraduationCap,
} from 'lucide-react';

/**
 * StudentAttendancePage
 * Recreated faithfully from approved Reference 2 (media_1789842049964.jpg).
 */
const StudentAttendancePage = () => {
  const [selectedYear, setSelectedYear] = useState('2025 - 2026');
  const [selectedSemester, setSelectedSemester] = useState('Semester I');

  // Attendance metrics
  const stats = [
    {
      label: 'Overall Attendance',
      value: '85%',
      icon: Users,
      color: '#16a34a',
      bg: '#f0fdf4',
      barColor: '#16a34a',
      percent: 85,
    },
    {
      label: 'Total Subjects',
      value: '6',
      icon: BookOpen,
      color: '#2563eb',
      bg: '#eff6ff',
      barColor: '#2563eb',
      percent: 100,
    },
    {
      label: 'Subjects ≥ 75%',
      value: '5',
      icon: CheckCircle2,
      color: '#9333ea',
      bg: '#faf5ff',
      barColor: '#9333ea',
      percent: 83,
    },
    {
      label: 'Subject < 75%',
      value: '1',
      icon: AlertTriangle,
      color: '#dc2626',
      bg: '#fef2f2',
      barColor: '#dc2626',
      percent: 17,
    },
  ];

  // Subject table data
  const subjects = [
    {
      id: 1,
      code: 'CS301',
      name: 'Data Structures',
      held: 48,
      attended: 46,
      percentage: '95%',
      status: 'Good',
    },
    {
      id: 2,
      code: 'CS302',
      name: 'Database Management Systems',
      held: 50,
      attended: 44,
      percentage: '88%',
      status: 'Good',
    },
    {
      id: 3,
      code: 'CS303',
      name: 'Operating Systems',
      held: 46,
      attended: 40,
      percentage: '87%',
      status: 'Good',
    },
    {
      id: 4,
      code: 'CS304',
      name: 'Software Engineering',
      held: 48,
      attended: 34,
      percentage: '71%',
      status: 'Low',
    },
    {
      id: 5,
      code: 'CS305',
      name: 'Web Technologies',
      held: 42,
      attended: 40,
      percentage: '95%',
      status: 'Good',
    },
    {
      id: 6,
      code: 'CS306',
      name: 'Artificial Intelligence',
      held: 44,
      attended: 38,
      percentage: '86%',
      status: 'Good',
    },
  ];

  // Monthly trend data
  const monthlyTrends = [
    { month: 'Jun 2025', rate: 82 },
    { month: 'Jul 2025', rate: 86 },
    { month: 'Aug 2025', rate: 88 },
    { month: 'Sep 2025', rate: 84 },
    { month: 'Oct 2025', rate: 87 },
    { month: 'Nov 2025', rate: 90 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Filters & Breadcrumbs */}
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
            Attendance
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Track your attendance and stay on top of your academics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', marginRight: '0.5rem' }}>
            Home &gt; <span style={{ color: '#2563eb', fontWeight: 600 }}>Attendance</span>
          </span>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
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
              <option value="2025 - 2026">2025 - 2026</option>
              <option value="2024 - 2025">2024 - 2025</option>
            </select>
            <ChevronDown
              size={14}
              color="#64748b"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>

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
              <option value="Semester I">Semester I</option>
              <option value="Semester II">Semester II</option>
            </select>
            <ChevronDown
              size={14}
              color="#64748b"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* 2. Top Hero Promotional Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0e7ff 100%)',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '1.75rem 2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: '#1e3a8a',
              margin: '0 0 0.35rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            Regular Attendance Builds a Brighter Future
          </h2>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#2563eb',
              margin: 0,
            }}
          >
            Attend Today, Achieve Tomorrow!
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="attendance-banner-art"
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#1e40af',
                transform: 'rotate(-4deg)',
              }}
            >
              Small Steps
            </div>
            <div
              style={{
                fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#2563eb',
                transform: 'rotate(-4deg)',
              }}
            >
              Big Goals
            </div>
          </div>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
              color: '#2563eb',
            }}
          >
            <BookOpen size={32} />
          </div>
        </div>
      </div>

      {/* 3. 4 Stat Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.25rem 1.35rem',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: s.bg,
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                    {s.label}
                  </div>
                </div>
              </div>

              {/* Progress Bar Line */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${s.percent}%`,
                    height: '100%',
                    backgroundColor: s.barColor,
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Main Two-Column Content Canvas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
        }}
        className="attendance-main-grid"
      >
        {/* Left Column: Subject-wise Table + Monthly Trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Subject-wise Attendance Table Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <BookOpen size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Subject-wise Attendance
                </h3>
              </div>

              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <span>View Detailed Report</span>
                <BarChart3 size={14} />
              </button>
            </div>

            {/* Table Container */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Subject Code</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Subject Name</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Classes Held</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Classes Attended</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Attendance %</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'center' }}>View</th>
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
                      <td style={{ padding: '0.875rem 0.5rem', color: '#64748b', fontWeight: 600 }}>{s.id}</td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#0f172a', fontWeight: 700 }}>{s.code}</td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#334155', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#475569', textAlign: 'center' }}>{s.held}</td>
                      <td style={{ padding: '0.875rem 0.5rem', color: '#475569', textAlign: 'center' }}>{s.attended}</td>
                      <td
                        style={{
                          padding: '0.875rem 0.5rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          color: s.status === 'Low' ? '#dc2626' : '#0f172a',
                        }}
                      >
                        {s.percentage}
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '9999px',
                            backgroundColor: s.status === 'Good' ? '#f0fdf4' : '#fef2f2',
                            color: s.status === 'Good' ? '#16a34a' : '#dc2626',
                            border: `1px solid ${s.status === 'Good' ? '#bbf7d0' : '#fecaca'}`,
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', textAlign: 'center' }}>
                        <button
                          title="View Attendance Details"
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#2563eb',
                            cursor: 'pointer',
                            padding: '0.25rem',
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Attendance Trend & Consistency Motivation */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Trend Bar Chart Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                flex: 1.5,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={17} color="#2563eb" />
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Monthly Attendance Trend
                  </h4>
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    style={{
                      appearance: 'none',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.25rem 1.75rem 0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Last 6 Months</option>
                    <option>Current Year</option>
                  </select>
                  <ChevronDown
                    size={12}
                    color="#64748b"
                    style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>
              </div>

              {/* Bar Chart Representation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  height: '140px',
                  paddingTop: '1.5rem',
                  gap: '0.75rem',
                }}
              >
                {monthlyTrends.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      height: '100%',
                      justifyContent: 'flex-end',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#2563eb' }}>
                      {t.rate}%
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '36px',
                        height: `${t.rate}%`,
                        backgroundColor: '#60a5fa',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <span style={{ fontSize: '0.6875rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {t.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consistency Creates Success Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.875rem',
                }}
              >
                <GraduationCap size={28} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                Consistency Creates Success
              </h4>
              <p
                style={{
                  fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                &ldquo;Show up, keep learning, and the results will follow.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Overall Ring + Insights + Important Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Overall Attendance Donut Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="#2563eb" />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Overall Attendance
                </h4>
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#16a34a' }}>85%</span>
            </div>

            {/* Circular Gauge Representation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#16a34a 0% 85%, #e2e8f0 85% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '94px',
                    height: '94px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>85%</span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#16a34a' }}>Present</span>
                </div>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
                <div>Total Classes: <strong style={{ color: '#0f172a' }}>278</strong></div>
                <div>Attended: <strong style={{ color: '#16a34a' }}>236</strong></div>
              </div>
            </div>
          </div>

          {/* Attendance Insights Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BarChart3 size={18} color="#2563eb" />
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Attendance Insights
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4 }}>
                  You are maintaining good attendance.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4 }}>
                  1 subject is below 75%. Try to improve it.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Lightbulb size={18} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4 }}>
                  Regular attendance helps in better performance and placement opportunities.
                </span>
              </div>
            </div>
          </div>

          {/* Important Notes Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Megaphone size={18} color="#ef4444" />
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Important Notes
              </h4>
            </div>

            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
              <li>Minimum 75% attendance is required as per institute guidelines.</li>
              <li>Attendance is updated regularly by the faculty.</li>
              <li>Contact your academic advisor for any discrepancies.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .attendance-main-grid {
            grid-template-columns: 1.4fr 0.85fr !important;
          }
        }
        @media (max-width: 768px) {
          .attendance-banner-art {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentAttendancePage;
