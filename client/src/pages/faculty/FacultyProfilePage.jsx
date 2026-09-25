import { useState, useEffect } from 'react';
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
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';
import FacultyTabs from '../../components/faculty/FacultyTabs';
import FacultyTable from '../../components/faculty/FacultyTable';
import facultyService from '../../services/facultyService';
import { useAuth } from '../../context/AuthContext';

/**
 * FacultyProfilePage
 * Complete faculty profile view matching the exact reference design with MongoDB Atlas persistence.
 */
const FacultyProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Subjects Handling');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state for faculty-editable fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    personalEmail: '',
    qualification: '',
    specialization: '',
    officeLocation: '',
    officeHours: '',
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await facultyService.getMe();
      if (res && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch faculty profile from /api/faculty/me:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openEditModal = () => {
    setFormData({
      name: profile?.user?.name || user?.name || 'Dr. R. Mehta',
      phone: profile?.user?.phone || user?.phone || '+91 98765 43210',
      personalEmail: profile?.personalEmail || 'rmehta@vignanlara.ac.in',
      qualification: profile?.qualification || 'Ph.D. in Computer Science & Engineering',
      specialization: profile?.specialization || 'Artificial Intelligence & Deep Learning',
      officeLocation: profile?.officeLocation || 'Cabin #304, Admin & Academic Block, 3rd Floor',
      officeHours: profile?.officeHours || 'Mon - Fri: 2:00 PM - 4:30 PM',
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      personalEmail: formData.personalEmail.trim(),
      qualification: formData.qualification.trim(),
      specialization: formData.specialization.trim(),
      officeLocation: formData.officeLocation.trim(),
      officeHours: formData.officeHours.trim(),
    };

    try {
      const res = await facultyService.updateMe(payload);
      if (res && res.data) {
        setProfile(res.data);
      }
      setIsModalOpen(false);
      setToastMessage('✅ Faculty profile updated successfully in MongoDB Atlas.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unable to save profile changes.';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

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

  // Resolved faculty data
  const facultyData = {
    name: profile?.user?.name || user?.name || 'Dr. R. Mehta',
    designation: profile?.designation || 'Assistant Professor',
    department: profile?.department?.name || 'Department of Computer Science & Engineering',
    employeeId: profile?.employeeId || user?.profile?.employeeId || 'VLIT/CSE/1046',
    email: profile?.user?.email || user?.email || 'rmehta@vignanlara.ac.in',
    personalEmail: profile?.personalEmail || profile?.user?.email || 'rmehta@vignanlara.ac.in',
    phone: profile?.user?.phone || user?.phone || '+91 98765 43210',
    joiningDate: profile?.joiningDate
      ? new Date(profile.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '12 Aug 2022',
    qualification: profile?.qualification || 'Ph.D. in Computer Science & Engineering',
    specialization: profile?.specialization || 'Artificial Intelligence & Deep Learning',
    officeLocation: profile?.officeLocation || 'Cabin #304, Admin & Academic Block, 3rd Floor',
    officeHours: profile?.officeHours || 'Mon - Fri: 2:00 PM - 4:30 PM',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

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
            {/* Faculty Avatar */}
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
                {facultyData.name}
              </h2>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.2rem' }}>
                {facultyData.designation}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.5rem' }}>
                {facultyData.department} &bull; Vignan&apos;s Lara Institute of Technology &amp; Science
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
                Faculty ID: {facultyData.employeeId}
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={openEditModal}
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
            <span>Edit Profile</span>
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
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.personalEmail || facultyData.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.phone}</div>
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
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.joiningDate}</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Highest Qualification</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.qualification}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Specialization</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.specialization}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Cabin / Office Location</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.officeLocation}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Consultation / Office Hours</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{facultyData.officeHours}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub Tabs & Content */}
      <FacultyTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab: Subjects Handling */}
      {activeTab === 'Subjects Handling' && (
        <FacultyTable
          columns={[
            { key: 'code', label: 'Subject Code', width: '130px' },
            { key: 'name', label: 'Subject Name' },
            { key: 'semester', label: 'Year / Semester', width: '150px' },
            { key: 'section', label: 'Sections Handled', width: '150px' },
          ]}
        >
          {subjectsHandling.map((sub) => (
            <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#2563eb', fontSize: '0.8125rem' }}>{sub.code}</td>
              <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={15} color="#64748b" />
                  <span>{sub.name}</span>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>{sub.semester}</td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                  {sub.section}
                </span>
              </td>
            </tr>
          ))}
        </FacultyTable>
      )}

      {/* Tab: Research & Publications */}
      {activeTab === 'Research & Publications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {publications.map((pub, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{pub.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#2563eb', fontWeight: 600 }}>{pub.journal} &bull; {pub.year}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DOI: {pub.doi}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  {pub.citations} Citations
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Achievements */}
      {activeTab === 'Achievements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{ach.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{ach.org}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb' }}>{ach.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Professional Development */}
      {activeTab === 'Professional Development' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {professionalDev.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>Organized / Validated by: {item.mode}</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#334155', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                {item.date}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => !saving && setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              border: '1.5px solid #e2e8f0',
              padding: '2rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  Edit Faculty Profile
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Update your contact details, qualification, specialization, and office hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !saving && setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Institutional Security Notice */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <ShieldAlert size={16} color="#64748b" />
              <span>
                <strong>Institutional Notice:</strong> Employee ID ({facultyData.employeeId}), Department ({facultyData.department}), and official designation are protected institutional records managed by Administration.
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Personal / Professional Email
                </label>
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  placeholder="e.g. rmehta@vignanlara.ac.in"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="Ph.D. in Computer Science"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Specialization / Area of Research
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="AI, Machine Learning, NLP"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Cabin / Office Location
                  </label>
                  <input
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                    placeholder="Cabin #304, Academic Block"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Consultation Hours
                  </label>
                  <input
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    placeholder="Mon - Fri: 2:00 PM - 4:30 PM"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyProfilePage;
