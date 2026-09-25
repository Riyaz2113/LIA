import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  FileCheck,
  Clock,
  UploadCloud,
  FileSpreadsheet,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyTabs from '../../components/faculty/FacultyTabs';
import { notificationService } from '../../services/notificationService';

/**
 * FacultyNotificationsPage
 * Notifications management view for faculty.
 * Displays real-time academic alerts, submission notifications, timetable updates, and read/unread states.
 */
const FacultyNotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Student Submission',
      desc: 'Rahul Kumar (21BCS101) submitted "Assignment 1 - Search Algorithms" for CS306.',
      time: '10 mins ago',
      category: 'Submissions',
      unread: true,
      icon: FileCheck,
      color: '#2563eb',
      bg: '#eff6ff',
      link: '/faculty/submissions',
    },
    {
      id: 2,
      title: 'Attendance Reminder',
      desc: "Don't forget to mark today's attendance for CS304 (III Year - Section A).",
      time: '1 hour ago',
      category: 'Attendance',
      unread: true,
      icon: Clock,
      color: '#16a34a',
      bg: '#f0fdf4',
      link: '/faculty/attendance',
    },
    {
      id: 3,
      title: 'Material Uploaded Successfully',
      desc: '"Unit 1 - Introduction to AI.pdf" is now live for all IV Year students.',
      time: '3 hours ago',
      category: 'Materials',
      unread: false,
      icon: UploadCloud,
      color: '#9333ea',
      bg: '#faf5ff',
      link: '/faculty/materials',
    },
    {
      id: 4,
      title: 'Marks Pending Publication',
      desc: 'Draft marks for CS301 Internal Assessment 1 are ready for final review and publishing.',
      time: '1 day ago',
      category: 'Marks',
      unread: false,
      icon: FileSpreadsheet,
      color: '#ea580c',
      bg: '#fff7ed',
      link: '/faculty/marks',
    },
    {
      id: 5,
      title: 'Faculty Meeting Scheduled',
      desc: 'Department review meeting on Friday at 3:00 PM in the Main Conference Hall.',
      time: '2 days ago',
      category: 'General',
      unread: false,
      icon: Calendar,
      color: '#0f172a',
      bg: '#f8fafc',
      link: '/faculty/timetable',
    },
  ]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      if (res && res.data && res.data.length > 0) {
        setNotifications(res.data.map((n, idx) => ({
          id: n._id || idx + 1,
          title: n.title,
          desc: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
          category: n.category ? `${n.category.charAt(0).toUpperCase() + n.category.slice(1).toLowerCase()}` : 'General',
          unread: !n.isRead,
          icon: n.category === 'ACADEMIC' ? FileCheck : Bell,
          color: '#2563eb',
          bg: '#eff6ff',
          link: '/faculty/classes'
        })));
      }
    } catch (err) {
      console.warn('Using default notifications:', err.message);
    }
  };

  const tabs = [
    { id: 'All', name: 'All' },
    { id: 'Submissions', name: 'Submissions' },
    { id: 'Attendance', name: 'Attendance' },
    { id: 'Marks', name: 'Marks' },
  ];

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    return n.category === activeFilter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <FacultyPageHeader
        title="Notifications"
        subtitle="Stay updated on submissions, schedule updates, and system notices."
        rightContent={
          <button
            type="button"
            onClick={markAllAsRead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1.5px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <CheckCheck size={16} color="#2563eb" />
            <span>Mark All as Read</span>
          </button>
        }
      />

      {/* 2. Filter Tabs */}
      <FacultyTabs tabs={tabs} activeTab={activeFilter} onTabChange={setActiveFilter} />

      {/* 3. Notifications Feed Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '0.75rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {filteredNotifs.map((notif) => {
          const Icon = notif.icon;
          return (
            <div
              key={notif.id}
              onClick={() => toggleRead(notif.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: notif.unread ? '#f0f7ff' : '#ffffff',
                border: notif.unread ? '1px solid #bfdbfe' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
              className="faculty-notif-row"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
                {/* Category Icon */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: notif.bg,
                    color: notif.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                {/* Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                      {notif.title}
                    </span>
                    {notif.unread && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#2563eb',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.4 }}>
                    {notif.desc}
                  </div>
                </div>
              </div>

              {/* Right Side: Timestamp & Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  {notif.time}
                </span>

                <Link
                  to={notif.link}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#2563eb',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>View</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .faculty-notif-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default FacultyNotificationsPage;
