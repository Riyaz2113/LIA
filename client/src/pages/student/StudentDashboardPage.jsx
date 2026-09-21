import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Bell,
  Briefcase,
  ChevronRight,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * StudentDashboardPage
 * Main home dashboard for students matching the approved reference.
 * Provides welcome banner, quick academic stat cards, today's timetable, notices, and exam schedules.
 */
const StudentDashboardPage = () => {
  const { user } = useAuth();
  const studentName = user?.name || 'Rahul Kumar';
  const rollNumber = user?.profile?.rollNumber || '21BCS101';

  const stats = [
    { label: 'Overall Attendance', value: '85%', sub: '236 / 278 Classes', color: '#16a34a', bg: '#f0fdf4', icon: CheckSquare },
    { label: 'Current CGPA', value: '8.32', sub: 'Semester V Completed', color: '#2563eb', bg: '#eff6ff', icon: Award },
    { label: 'Current Subjects', value: '6', sub: 'Semester VI (2025-26)', color: '#9333ea', bg: '#faf5ff', icon: BookOpen },
    { label: 'Upcoming Exams', value: '2', sub: 'Starts Oct 05, 2026', color: '#ea580c', bg: '#fff7ed', icon: Calendar },
  ];

  const todayClasses = [
    { time: '09:00 - 10:00 AM', code: 'CS301', subject: 'Data Structures', room: 'Room 302', faculty: 'Dr. R. Mehta', status: 'Completed' },
    { time: '10:00 - 11:00 AM', code: 'CS302', subject: 'Database Management Systems', room: 'Room 304', faculty: 'Dr. S. Rao', status: 'Ongoing' },
    { time: '11:15 - 12:15 PM', code: 'CS303', subject: 'Operating Systems', room: 'Room 302', faculty: 'Dr. P. Kumar', status: 'Upcoming' },
    { time: '01:30 - 03:30 PM', code: 'CS305', subject: 'Web Technologies Lab', room: 'Lab 4', faculty: 'Ms. A. Reddy', status: 'Upcoming' },
  ];

  const recentNotices = [
    { id: 1, title: 'Internal Assessment Schedule Released', category: 'Academic', date: 'Sep 14, 2026' },
    { id: 2, title: 'Fee Payment Reminder for Final Semester', category: 'General', date: 'Sep 10, 2026' },
    { id: 3, title: 'TCS Placement Training Program', category: 'Placements', date: 'Sep 08, 2026' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Page Header & Welcome Banner */}
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
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.25rem 0',
            }}
          >
            Student Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Welcome back, <span style={{ color: '#2563eb', fontWeight: 600 }}>{studentName}</span> ({rollNumber}) &mdash; III Year CSE | Section A
          </p>
        </div>

        {/* Action Button to Chat */}
        <Link
          to="/chat"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
          }}
        >
          <span>Ask LIA Assistant</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
                padding: '1.25rem 1.375rem',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.35rem' }}>
                  {s.sub}
                </div>
              </div>

              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: s.bg,
                  color: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={22} strokeWidth={2.4} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Split Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
        }}
        className="dashboard-main-grid"
      >
        {/* Left Column: Today's Classes & Timetable */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Today's Schedule Card */}
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Clock size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Today&apos;s Classes &amp; Timetable
                </h3>
              </div>
              <Link
                to="/student/subjects"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  textDecoration: 'none',
                }}
              >
                Full Timetable &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayClasses.map((cls, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    backgroundColor: cls.status === 'Ongoing' ? '#eff6ff' : '#f8fafc',
                    border: cls.status === 'Ongoing' ? '1.5px solid #bfdbfe' : '1px solid #f1f5f9',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        backgroundColor: '#ffffff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #dbeafe',
                      }}
                    >
                      {cls.code}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        {cls.subject}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {cls.faculty} &bull; {cls.room}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                      {cls.time}
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        color:
                          cls.status === 'Ongoing'
                            ? '#2563eb'
                            : cls.status === 'Completed'
                            ? '#16a34a'
                            : '#64748b',
                      }}
                    >
                      {cls.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notices Card */}
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Bell size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Recent Notices &amp; Circulars
                </h3>
              </div>
              <Link
                to="/student/notices"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  textDecoration: 'none',
                }}
              >
                View All &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentNotices.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {n.category}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {n.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance & Placements Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Attendance Highlights Card */}
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
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Attendance Status
              </h3>
              <Link
                to="/student/attendance"
                style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
              >
                Detailed Report &rarr;
              </Link>
            </div>

            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
                  ELIGIBILITY STATUS
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803d' }}>
                  Eligible for Semester Exams
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>85%</div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
              Minimum 75% aggregate attendance is required. All 5 out of 6 subjects currently satisfy institutional criteria.
            </div>
          </div>

          {/* Placement Drive Alert Card */}
          <div
            style={{
              backgroundColor: '#071126',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 8px 24px rgba(7, 17, 38, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Briefcase size={18} color="#60a5fa" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Featured Placement Drive
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
              TCS &mdash; Digital &amp; Ninja Hiring 2026
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
              Package: 7.0 &mdash; 9.0 LPA &bull; Eligibility: CSE, IT, ECE (60% Throughout). Drive Date: Oct 05, 2026.
            </p>
            <Link
              to="/student/placements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>View &amp; Apply</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1.35fr 0.85fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboardPage;
