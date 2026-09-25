import { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import { placementService } from '../../services/placementService';

/**
 * StudentPlacementsPage
 * Recreated faithfully from approved Reference 5 (media_1789841993528.jpg).
 */
const StudentPlacementsPage = () => {
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'placed' | 'resources'
  const [searchQuery, setSearchQuery] = useState('');

  const [drivesList, setDrivesList] = useState([
    { id: 1, company: 'TCS', role: 'Software Developer', eligibility: 'B.Tech (All Branches)', date: 'Oct 05, 2026', location: 'On Campus', status: 'Open', applied: false },
    { id: 2, company: 'Infosys', role: 'Systems Engineer', eligibility: 'B.Tech (CS/IT/ECE)', date: 'Oct 12, 2026', location: 'On Campus', status: 'Open', applied: false },
    { id: 3, company: 'Accenture', role: 'Application Developer', eligibility: 'B.Tech (All Branches)', date: 'Oct 20, 2026', location: 'Off Campus', status: 'Coming Soon', applied: false },
    { id: 4, company: 'Wipro', role: 'Project Engineer', eligibility: 'B.Tech (All Branches)', date: 'Nov 01, 2026', location: 'On Campus', status: 'Coming Soon', applied: false },
  ]);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await placementService.getAllDrives();
      if (res && res.data && res.data.length > 0) {
        setDrivesList(res.data.map(d => ({
          id: d._id || d.id,
          company: d.company?.name || d.companyName || d.company || 'Company',
          role: d.title || d.role || 'Software Engineer',
          eligibility: d.eligibilityCriteria?.departments?.join(', ') || d.eligibility || 'B.Tech (All Branches)',
          date: d.driveDate ? new Date(d.driveDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'TBD',
          location: 'On Campus',
          status: d.status === 'COMPLETED' ? 'Closed' : 'Open',
          applied: false
        })));
      }
    } catch (err) {
      console.warn('Using default placement drives:', err.message);
    }
  };

  const drives = drivesList;

  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Search and Tabs */}
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
            Placements
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Explore opportunities, prepare and achieve your career goals.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search companies, roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.25rem',
              borderRadius: '8px',
              border: '1.5px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '0.8125rem',
              color: '#0f172a',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 2. Tabs Navigation Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
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
            onClick={() => setActiveTab('drives')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'drives' ? '#2563eb' : 'transparent',
              color: activeTab === 'drives' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            Upcoming Drives
          </button>
          <button
            onClick={() => setActiveTab('placed')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'placed' ? '#2563eb' : 'transparent',
              color: activeTab === 'placed' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            Placed Students
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'resources' ? '#2563eb' : 'transparent',
              color: activeTab === 'resources' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            Resources
          </button>
        </div>

        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', cursor: 'pointer' }}>
          View All &gt;
        </span>
      </div>

      {/* 3. Main Content Tab View */}
      {activeTab === 'drives' && (
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
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Company</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Role</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Eligibility</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Location</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Apply</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrives.map((d) => (
                  <tr
                    key={d.id}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 800 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                          }}
                        >
                          {d.company[0]}
                        </div>
                        <span>{d.company}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 600 }}>{d.role}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>{d.eligibility}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 600 }}>{d.date}</td>
                    <td style={{ padding: '1rem 0.75rem', color: '#475569' }}>{d.location}</td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: d.status === 'Open' ? '#f0fdf4' : '#fff7ed',
                          color: d.status === 'Open' ? '#16a34a' : '#ea580c',
                          border: `1px solid ${d.status === 'Open' ? '#bbf7d0' : '#fed7aa'}`,
                        }}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                      {d.status === 'Open' ? (
                        <button
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.35rem 1.1rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                          }}
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#ea580c',
                            border: '1px solid #fed7aa',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Notify Me
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'placed' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Placement Records (2025 - 2026)
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Over 850+ students placed across top global tech leaders and high-growth innovators.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>18.5 LPA</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Highest Package</div>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>6.2 LPA</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Average Package</div>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#9333ea' }}>120+</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Recruiting Companies</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Placement Preparation Resources
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Standard Resume Templates</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>ATS-optimized college formats</div>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>DSA &amp; Aptitude Handbooks</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Curated interview question banks</div>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Technical Interview Roadmaps</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>System design &amp; core subjects</div>
            </div>
          </div>
        </div>
      )}

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
            <TrendingUp size={24} />
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
              Opportunities don&apos;t happen, you create them.
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#2563eb' }}>
              Stay skilled, stay ready!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPlacementsPage;
