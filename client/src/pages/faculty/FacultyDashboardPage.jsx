import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileCheck,
  Megaphone,
  Clock,
  CheckSquare,
  UploadCloud,
  FileSpreadsheet,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  BookMarked,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FacultyStatCard from '../../components/faculty/FacultyStatCard';
import { dashboardService } from '../../services/dashboardService';
import { timetableService } from '../../services/timetableService';

/**
 * FacultyDashboardPage
 * Main home dashboard for faculty matching the exact approved reference design.
 * Features morning greeting card with campus visual, 4 stat cards, today's schedule with "Start Class",
 * Quick Actions grid, and academic motivation card.
 */
const FacultyDashboardPage = () => {
  const { user } = useAuth();
  const facultyName = user?.name || (user?.profile?.firstName ? `Dr. ${user.profile.firstName} ${user.profile.lastName}` : 'Dr. R. Mehta');
  const facultyDept = user?.profile?.department || 'Computer Science & Engineering';

  const [statsData, setStatsData] = useState({
    subjectsCount: '4',
    studentsCount: '120',
    pendingSubmissions: '18',
    announcementsCount: '6'
  });

  const [scheduleList, setScheduleList] = useState([
    { time: '09:00 AM - 09:50 AM', subject: 'Data Structures', section: 'IV Year - A', room: 'Room 204', active: true, hasButton: true },
    { time: '11:00 AM - 11:50 AM', subject: 'Database Management Systems', section: 'III Year - B', room: 'Room 310' },
    { time: '01:30 PM - 02:20 PM', subject: 'Artificial Intelligence', section: 'III Year - A', room: 'Room 208' },
    { time: '03:00 PM - 03:50 PM', subject: 'Design & Analysis of Algorithms', section: 'II Year - C', room: 'Room 105' },
  ]);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const statsRes = await dashboardService.getFacultyStats();
      if (statsRes && statsRes.data) {
        setStatsData({
          subjectsCount: `${statsRes.data.assignedSubjectsCount || 4}`,
          studentsCount: `${statsRes.data.totalStudentsCount || 120}`,
          pendingSubmissions: `${statsRes.data.pendingSubmissionsCount || 18}`,
          announcementsCount: `${statsRes.data.announcementsCount || 6}`
        });
      }

      const scheduleRes = await timetableService.getFacultySchedule();
      if (scheduleRes && scheduleRes.data && scheduleRes.data.length > 0) {
        setScheduleList(scheduleRes.data.map((slot, idx) => ({
          time: `${slot.startTime || '09:00 AM'} - ${slot.endTime || '09:50 AM'}`,
          subject: slot.subject?.name || slot.subjectCode || 'Data Structures',
          section: slot.section ? `Year ${slot.year || 'IV'} - ${slot.section}` : 'IV Year - A',
          room: slot.room || 'Room 204',
          active: idx === 0,
          hasButton: idx === 0
        })));
      }
    } catch (err) {
      console.warn('Using default faculty dashboard stats:', err.message);
    }
  };

  const stats = [
    { label: 'Subjects', value: statsData.subjectsCount, icon: BookOpen, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Students', value: statsData.studentsCount, icon: Users, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Pending Submissions', value: statsData.pendingSubmissions, icon: FileCheck, color: '#9333ea', bg: '#faf5ff' },
    { label: 'Announcements', value: statsData.announcementsCount, icon: Megaphone, color: '#ea580c', bg: '#fff7ed' },
  ];

  const todaySchedule = scheduleList;

  const quickActions = [
    { label: 'Take Attendance', icon: CheckSquare, color: '#16a34a', bg: '#f0fdf4', path: '/faculty/attendance' },
    { label: 'Upload Material', icon: UploadCloud, color: '#2563eb', bg: '#eff6ff', path: '/faculty/materials' },
    { label: 'Enter Marks', icon: FileSpreadsheet, color: '#ea580c', bg: '#fff7ed', path: '/faculty/marks' },
    { label: 'View Submissions', icon: FileCheck, color: '#9333ea', bg: '#faf5ff', path: '/faculty/submissions' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Top Greeting Card with Campus Architectural Visual */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '1.75rem 2rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="faculty-greeting-card"
      >
        {/* Left Side: Greeting, Department, and Quote */}
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
            Good Morning,
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.4rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {facultyName} <span role="img" aria-label="wave">👋</span>
          </h1>

          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '0.75rem',
            }}
          >
            {facultyDept}
          </div>

          <p
            style={{
              fontSize: '0.875rem',
              color: '#475569',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            &ldquo;Teaching is the one profession that creates all other professions.&rdquo;
          </p>
        </div>

        {/* Right Side: Date Badge + Architectural Campus Visual */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 2,
          }}
          className="faculty-greeting-right"
        >
          {/* Top Date */}
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#64748b',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Calendar size={14} color="#2563eb" />
            <span>Thursday, 18 September 2026</span>
          </div>

          {/* Campus Illustration */}
          <div
            style={{
              width: '180px',
              height: '80px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
            }}
          >
            <img
              src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_57_26 PM.png"
              alt="Campus"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Four Statistic Metric Cards */}
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

      {/* 3. Main Split Section: Today's Schedule (Left) & Quick Actions / Motivation (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
        }}
        className="faculty-dashboard-grid"
      >
        {/* Left Column (65%): Today's Schedule */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Header */}
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
                Today&apos;s Schedule
              </h3>
            </div>
            <Link
              to="/faculty/timetable"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#2563eb',
                textDecoration: 'none',
              }}
            >
              View Full Timetable &rarr;
            </Link>
          </div>

          {/* Timeline Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {todaySchedule.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  backgroundColor: item.active ? '#eff6ff' : '#f8fafc',
                  border: item.active ? '1.5px solid #bfdbfe' : '1px solid #f1f5f9',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {/* Time Badge */}
                <div style={{ minWidth: '150px' }}>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: item.active ? '#2563eb' : '#0f172a',
                    }}
                  >
                    {item.time.split(' - ')[0]}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                    {item.time.split(' - ')[1]}
                  </div>
                </div>

                {/* Subject & Section Info */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                    {item.subject}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    {item.section} {item.room && <span>&bull; {item.room}</span>}
                  </div>
                </div>

                {/* Right Action Button */}
                {item.hasButton && (
                  <Link
                    to="/faculty/attendance"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    <span>Start Class</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
                {!item.hasButton && item.room && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#64748b',
                      backgroundColor: '#ffffff',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {item.room}
                  </span>
                )}
                {item.isMeeting && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#9333ea',
                      backgroundColor: '#faf5ff',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #f3e8ff',
                    }}
                  >
                    Conference Hall
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (35%): Quick Actions & Bottom Motivation Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sparkles size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Quick Actions
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.875rem',
              }}
            >
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    to={action.path}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.1rem 0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      textDecoration: 'none',
                      textAlign: 'center',
                      gap: '0.5rem',
                      transition: 'all 150ms ease',
                    }}
                    className="faculty-quick-action-tile"
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: action.bg,
                        color: action.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Academic Motivation / Books Card */}
          <div
            style={{
              backgroundColor: '#eff6ff',
              borderRadius: '16px',
              border: '1.5px solid #dbeafe',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1e40af', lineHeight: 1.3 }}>
                Education today, <br />
                brighter tomorrow.
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                LIA Faculty Suite
              </div>
            </div>

            {/* Stacked Books Vector Graphic */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                flexShrink: 0,
              }}
            >
              <BookMarked size={26} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .faculty-dashboard-grid {
            grid-template-columns: 1.45fr 0.85fr !important;
          }
        }
        .faculty-quick-action-tile:hover {
          background-color: #eff6ff !important;
          border-color: #bfdbfe !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default FacultyDashboardPage;
