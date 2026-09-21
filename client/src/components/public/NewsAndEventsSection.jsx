import { ArrowRight, Clock, MapPin } from 'lucide-react';

/**
 * NewsAndEventsSection
 * Recreates the Announcements and Upcoming Events two-column layout from the reference.
 * Structured with clean props/state for seamless future connection to MongoDB Notice & Event models.
 */
const NewsAndEventsSection = () => {
  const announcements = [
    {
      id: 'ann-1',
      month: 'SEP',
      day: '15',
      title: 'Internal Exam Schedule Released',
      isNew: true,
      description: 'II B.Tech Internal Exams from Oct 5, 2026',
    },
    {
      id: 'ann-2',
      month: 'SEP',
      day: '12',
      title: 'Tech Fest - LARA UTSAV 2026',
      isNew: false,
      description: 'Registrations are now open!',
    },
    {
      id: 'ann-3',
      month: 'SEP',
      day: '10',
      title: 'Placement Drive - TCS',
      isNew: false,
      description: 'Eligible students, please register by Sep 20',
    },
    {
      id: 'ann-4',
      month: 'SEP',
      day: '08',
      title: 'Holiday Notice',
      isNew: false,
      description: 'College will remain closed on Sep 17 (Ganesh Chaturthi)',
    },
  ];

  const events = [
    {
      id: 'evt-1',
      month: 'SEP',
      day: '20',
      title: 'AI & ML Workshop',
      time: '10:00 AM',
      location: 'Seminar Hall',
    },
    {
      id: 'evt-2',
      month: 'SEP',
      day: '25',
      title: 'Hackathon 2026',
      time: '9:00 AM',
      location: 'Main Auditorium',
    },
    {
      id: 'evt-3',
      month: 'OCT',
      day: '01',
      title: 'Alumni Interaction',
      time: '11:00 AM',
      location: 'Online',
    },
    {
      id: 'evt-4',
      month: 'OCT',
      day: '10',
      title: 'Technical Club Meetup',
      time: '4:00 PM',
      location: 'Innovation Lab',
    },
  ];

  return (
    <section
      id="campus-life"
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div className="container">
        {/* Section Tag */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="section-tag">NEWS &amp; EVENTS</div>
        </div>

        {/* 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }}
          className="news-events-grid"
        >
          {/* Left Column: Latest Announcements */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                Latest Announcements
              </h2>
              <a
                href="#announcements"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#2563eb',
                }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {announcements.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    transition: 'all 150ms ease',
                  }}
                  className="news-card-hover"
                >
                  {/* Date Badge */}
                  <div
                    style={{
                      width: '48px',
                      height: '52px',
                      borderRadius: '10px',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b' }}>
                      {item.month}
                    </span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                      {item.day}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: '#0f172a',
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.isNew && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            backgroundColor: '#ea580c',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          New
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: '#64748b',
                        marginTop: '0.125rem',
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Upcoming Events */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                Upcoming Events
              </h2>
              <a
                href="#events"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#2563eb',
                }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {events.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    transition: 'all 150ms ease',
                  }}
                  className="news-card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                    {/* Date Badge */}
                    <div
                      style={{
                        width: '48px',
                        height: '52px',
                        borderRadius: '10px',
                        backgroundColor: '#fff1f2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#e11d48' }}>
                        {evt.month}
                      </span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#e11d48', lineHeight: 1 }}>
                        {evt.day}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {evt.title}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.875rem',
                          fontSize: '0.75rem',
                          color: '#64748b',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} />
                          {evt.time}
                        </span>
                        <span>&bull;</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} />
                          {evt.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="button"
                    className="btn-outline-blue"
                    style={{ flexShrink: 0 }}
                  >
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .news-events-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        .news-card-hover:hover {
          border-color: #bfdbfe !important;
          box-shadow: 0 4px 14px -2px rgba(37, 99, 235, 0.08) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default NewsAndEventsSection;
