import { useState } from 'react';
import {
  Bell,
  Download,
  FileText,
  Megaphone,
} from 'lucide-react';

/**
 * StudentNoticesPage
 * Recreated faithfully from approved Reference 6 (media_1789841993528.jpg).
 */
const StudentNoticesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Academic', 'Examination', 'Placements', 'General'];

  const notices = [
    {
      id: 1,
      title: 'Internal Assessment Schedule Released',
      category: 'Academic',
      date: 'Sep 14, 2026',
      description: 'Internal exam schedule for all B.Tech branches released. Verify time slots.',
    },
    {
      id: 2,
      title: 'Fee Payment Reminder',
      category: 'General',
      date: 'Sep 10, 2026',
      description: 'Last date for semester fee payment without late fine is Sep 25, 2026.',
    },
    {
      id: 3,
      title: 'Placement Training Program',
      category: 'Placements',
      date: 'Sep 08, 2026',
      description: 'Special technical and soft skills training sessions start next Monday.',
    },
    {
      id: 4,
      title: 'Hostel Re-allotment Notice',
      category: 'General',
      date: 'Sep 05, 2026',
      description: 'Room re-allotment and maintenance schedule for all blocks posted.',
    },
    {
      id: 5,
      title: 'Alumni Interaction Session',
      category: 'Events',
      date: 'Sep 01, 2026',
      description: 'Session with alumni working at Google, Microsoft, and Amazon on career paths.',
    },
  ];

  const filteredNotices =
    selectedCategory === 'All'
      ? notices
      : notices.filter((n) => n.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryBadgeStyle = (cat) => {
    switch (cat) {
      case 'Academic':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      case 'General':
        return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
      case 'Placements':
        return { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' };
      case 'Events':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      default:
        return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with View All */}
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
            Notices
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Stay updated with important announcements.
          </p>
        </div>

        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', cursor: 'pointer' }}>
          View All &gt;
        </span>
      </div>

      {/* 2. Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.45rem 1.15rem',
              borderRadius: '8px',
              border: selectedCategory === cat ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: selectedCategory === cat ? '#2563eb' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#475569',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Notices Table Card */}
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
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Title</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Description</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((n) => {
                const badge = getCategoryBadgeStyle(n.category);
                return (
                  <tr
                    key={n.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{n.id}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 700 }}>{n.title}</td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {n.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>{n.date}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569', maxWidth: '300px' }}>
                      {n.description}
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <button
                        title="Download notice attachment"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          border: '1px solid #fecaca',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <FileText size={13} />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bottom Motivational Banner */}
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
            <Megaphone size={24} />
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
              Stay informed, stay ahead.
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb' }}>
              Important updates for a better you.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNoticesPage;
