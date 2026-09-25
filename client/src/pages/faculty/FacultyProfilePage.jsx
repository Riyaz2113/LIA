import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Edit3,
  Building,
  Clock,
  ExternalLink,
} from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyTabs from '../../components/faculty/FacultyTabs';
import FacultyTable from '../../components/faculty/FacultyTable';

/**
 * FacultyProfilePage
 * Complete faculty profile view matching the exact reference design.
 * Features profile summary card with ID badge, 2-column contact & academic specs,
 * and 4 sub-tabs (Subjects Handling, Research & Publications, Achievements, Professional Development).
 */
const FacultyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Subjects Handling');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'Subjects Handling', name: 'Subjects Handling' },
    { id: 'Research & Publications', name: 'Research & Publications' },
    { id: 'Achievements', name: 'Achievements' },
    { id: 'Professional Development', name: 'Professional Development' },
  ];

  const subjectsHandling = [
    { id: 1, code: 'CS301', name: 'Data Structures', semester: 'III Year', section: 'A, B' },
    { id: 2, code: 'CS304', name: 'Operating Systems', semester: 'III Year', section: 'A' },
    { id: 3, code: 'CS306', name: 'Artificial Intelligence', semester: 'IV Year', section: 'A' },
    { id: 4, code: 'CS308', name: 'Machine Learning', semester: 'IV Year', section: 'B' },
  ];

  const publications = [
    {
      title: 'Attention-Driven Deep Neural Models for Medical Image Segmentation',
      journal: 'IEEE Transactions on Artificial Intelligence',
      year: '2025',
      citations: 34,
      doi: '10.1109/TAI.2025.1092834',
    },
    {
      title: 'Hybrid Transformer Architectures for Low-Resource Indic NLP Processing',
      journal: 'ACM Transactions on Asian and Low-Resource Language Information',
      year: '2024',
      citations: 19,
      doi: '10.1145/3629182',
    },
    {
      title: 'Real-Time Edge Computer Vision for Autonomous Smart Campus Surveillance',
      journal: 'Springer Journal of Ambient Intelligence and Humanized Computing',
      year: '2023',
      citations: 42,
      doi: '10.1007/s12652-023-04521-1',
    },
  ];

  const achievements = [
    { title: 'Best Faculty Researcher Award 2025', org: "Vignan's Lara Institute of Technology & Science", year: '2025' },
    { title: 'DST-SERB Core Research Grant Recipient (₹28.5 Lakhs)', org: 'Department of Science & Technology, Govt. of India', year: '2024' },
    { title: 'Top 2% Highly Cited Author Recognition in AI & ML', org: 'Stanford-Elsevier Global Ranking', year: '2023' },
  ];

  const professionalDev = [
    { title: 'AICTE ATAL FDP on Generative AI and Large Language Models', date: 'Jul 2025', mode: 'IIT Madras' },
    { title: 'Senior Member, IEEE Computer Society (SMIEEE)', date: 'Since 2023', mode: 'Global Membership' },
    { title: 'Professional Member, Association for Computing Machinery (ACM)', date: 'Since 2021', mode: 'Active' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <FacultyPageHeader
        title="My Profile"
        subtitle="View and manage your personal and professional information."
      />

      {/* 2. Profile Details Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
        }}
      >
        {/* Top Row: Avatar, Identity, and Edit Profile Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingBottom: '1.75rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Faculty Large Photo/Avatar */}
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                backgroundColor: '#0f172a',
                border: '3px solid #2563eb',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <svg width="88" height="88" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" fill="#1e293b" />
                <circle cx="20" cy="15" r="7" fill="#f8fafc" />
                <path d="M10 34C10 26 14 24 20 24C26 24 30 26 30 34" fill="#3b82f6" />
                <path d="M15 15C15 15 17 17 20 17C23 17 25 15 25 15" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16.5" cy="14" r="1.5" fill="#0f172a" />
                <circle cx="23.5" cy="14" r="1.5" fill="#0f172a" />
                <rect x="14" y="12" width="5" height="3.5" rx="1" stroke="#0f172a" strokeWidth="1.2" fill="none" />
                <rect x="21" y="12" width="5" height="3.5" rx="1" stroke="#0f172a" strokeWidth="1.2" fill="none" />
                <line x1="19" y1="13.5" x2="21" y2="13.5" stroke="#0f172a" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Main Info */}
            <div>
              <h2
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '0 0 0.25rem 0',
                }}
              >
                Dr. R. Mehta
              </h2>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.2rem' }}>
                Assistant Professor
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.5rem' }}>
                Department of Computer Science &amp; Engineering &bull; Vignan&apos;s Lara Institute of Technology &amp; Science
              </div>

              {/* Faculty ID Badge */}
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                }}
              >
                Faculty ID: VLIT/CSE/1046
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: '1.5px solid #2563eb',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Edit3 size={16} />
            <span>{isEditing ? 'Close Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* 2-Column Professional Specs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem 2.5rem',
            paddingTop: '1.75rem',
          }}
        >
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>rmehta@vignanlara.ac.in</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>+91 98765 43210</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Location</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Guntur, Andhra Pradesh</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Date of Joining</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>12 Aug 2022</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Qualification</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Ph.D. (CSE)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Specialization</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Machine Learning, Data Science</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Research Interests</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>AI, NLP, Computer Vision</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Office Room &amp; Hours</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  301, CSE Block &bull; Mon - Fri, 10:00 AM - 4:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tabs */}
      <FacultyTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Tab Content */}
      {activeTab === 'Subjects Handling' && (
        <FacultyTable
          columns={[
            { header: '#', width: '60px' },
            { header: 'Subject Code', width: '160px' },
            { header: 'Subject Name' },
            { header: 'Semester', width: '140px' },
            { header: 'Section', width: '120px' },
          ]}
        >
          {subjectsHandling.map((sub) => (
            <tr
              key={sub.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 150ms ease',
              }}
              className="faculty-table-row"
            >
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{sub.id}</td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: '#2563eb' }}>
                {sub.code}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                {sub.name}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#475569' }}>{sub.semester}</td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#475569' }}>
                <span
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  {sub.section}
                </span>
              </td>
            </tr>
          ))}
        </FacultyTable>
      )}

      {activeTab === 'Research & Publications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {publications.map((p, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600 }}>
                  {p.journal} ({p.year})
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  DOI: {p.doi} &bull; Citations: {p.citations}
                </div>
              </div>

              <a
                href={`https://doi.org/${p.doi}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#2563eb',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>View Paper</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Achievements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#faf5ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                  {ach.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {ach.org} &bull; {ach.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Professional Development' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {professionalDev.map((dev, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                  {dev.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600, marginTop: '0.2rem' }}>
                  {dev.mode}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                {dev.date}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .faculty-table-row:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default FacultyProfilePage;
