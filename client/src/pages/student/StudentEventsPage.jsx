import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

/**
 * StudentEventsPage
 * Recreated faithfully from approved Reference 7 (media_1789841993528.jpg).
 */
const StudentEventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'

  const events = [
    {
      id: 1,
      title: 'Technical Talk on Cloud Computing',
      month: 'SEP',
      day: '18',
      time: '10:00 AM - 12:00 PM',
      location: 'Seminar Hall',
      category: 'Technical',
      categoryBg: '#eff6ff',
      categoryColor: '#2563eb',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Placement Training Session',
      month: 'SEP',
      day: '22',
      time: '02:00 PM - 04:00 PM',
      location: 'Auditorium',
      category: 'Placement',
      categoryBg: '#fff7ed',
      categoryColor: '#ea580c',
      image:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'Cultural Fest 2026',
      month: 'SEP',
      day: '28',
      time: 'All Day',
      location: 'Open Grounds',
      category: 'Cultural',
      categoryBg: '#fdf2f8',
      categoryColor: '#db2777',
      image:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'Alumni Interaction',
      month: 'OCT',
      day: '05',
      time: '11:00 AM - 01:00 PM',
      location: 'Seminar Hall',
      category: 'Alumni',
      categoryBg: '#eff6ff',
      categoryColor: '#2563eb',
      image:
        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const pastEvents = [
    {
      id: 101,
      title: 'Orientation & Induction 2025',
      month: 'AUG',
      day: '10',
      time: '09:00 AM - 01:00 PM',
      location: 'Main Auditorium',
      category: 'General',
      categoryBg: '#f8fafc',
      categoryColor: '#475569',
      image:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 102,
      title: 'Hackathon Lara 2025',
      month: 'AUG',
      day: '25',
      time: '24 Hours',
      location: 'CSE Labs Complex',
      category: 'Technical',
      categoryBg: '#eff6ff',
      categoryColor: '#2563eb',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const activeEvents = activeTab === 'upcoming' ? events : pastEvents;

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
            Events
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Participate, learn and grow beyond the classroom.
          </p>
        </div>

        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', cursor: 'pointer' }}>
          View All &gt;
        </span>
      </div>

      {/* 2. Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '0.25rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.45rem 1.25rem',
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
          Upcoming Events
        </button>
        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '0.45rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeTab === 'past' ? '#2563eb' : 'transparent',
            color: activeTab === 'past' ? '#ffffff' : '#64748b',
            transition: 'all 0.15s',
          }}
        >
          Past Events
        </button>
      </div>

      {/* 3. Event Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {activeEvents.map((e) => (
          <div
            key={e.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Event Photo Header with Date Badge */}
            <div style={{ position: 'relative', height: '140px' }}>
              <img
                src={e.image}
                alt={e.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Date Box */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '0.35rem 0.65rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.05em' }}>{e.month}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1 }}>{e.day}</div>
              </div>
            </div>

            {/* Event Content */}
            <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.3,
                  }}
                >
                  {e.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <Clock size={13} color="#94a3b8" />
                    <span>{e.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <MapPin size={13} color="#94a3b8" />
                    <span>{e.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Category Tag + View Details */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: e.categoryBg,
                    color: e.categoryColor,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                  }}
                >
                  {e.category}
                </span>

                <button
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
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
            <Sparkles size={24} />
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
              Be part of something bigger.
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb' }}>
              Events today, memories forever.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEventsPage;
