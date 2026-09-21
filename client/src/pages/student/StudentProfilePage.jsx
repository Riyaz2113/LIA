import { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Edit2,
  Calendar,
  CheckCircle2,
  Camera,
  Trophy,
  Heart,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * StudentProfilePage
 * Exact recreation of approved Reference 1 (media_1789842006398.png).
 * NOTE: As per strict instructions, Quick Links card is omitted.
 */
const StudentProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Student Mock Data
  const student = {
    name: user?.name || 'Rahul Kumar',
    rollNumber: user?.profile?.rollNumber || '21BCS101',
    branch: 'B.Tech - Computer Science and Engineering',
    year: 'III Year',
    section: 'Section A',
    status: 'Active Student',
    batch: '2023 - 2027',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',

    // Personal Info
    dob: '15 March 2004',
    gender: 'Male',
    email: 'rahulkumar21bcs101@vignan.ac.in',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    address: 'D.No. 12-5-34, Mangalagiri, Guntur, Andhra Pradesh - 522503',

    // Academic Info
    program: 'B.Tech - Computer Science and Engineering',
    admissionYear: '2023',
    expectedGraduation: '2027',
    cgpa: '8.32',
    advisor: 'Dr. S. Rao',
    department: 'Computer Science and Engineering',

    // Contact Info
    personalEmail: 'rahulkumar2004@gmail.com',
    collegeEmail: 'rahulkumar21bcs101@vignan.ac.in',
    contactPhone: '+91 98765 43210',
    alternatePhone: '+91 91234 56789',
    permanentAddress: 'D.No. 12-5-34, Mangalagiri, Guntur, Andhra Pradesh - 522503',

    // Emergency Contact
    guardianName: 'Suresh Kumar',
    relationship: 'Father',
    guardianPhone: '+91 99887 66554',
    guardianAltPhone: '+91 91234 56789',
    guardianAddress: 'D.No. 12-5-34, Mangalagiri, Guntur, Andhra Pradesh - 522503',

    // Achievements & Interests
    achievements: [
      '5★ HackerRank (Problem Solving)',
      '350+ LeetCode Problems',
      '60+ CodeChef Contests',
    ],
    interests: [
      'Machine Learning',
      'Web Development',
      'Competitive Programming',
      'Reading',
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Breadcrumbs & Action Button */}
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
            My Profile
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            View and manage your personal, academic and contact information.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Home &gt; <span style={{ color: '#2563eb', fontWeight: 600 }}>My Profile</span>
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'background-color 0.2s',
            }}
          >
            <Edit2 size={15} />
            <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Hero Student Identity Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 2.5rem',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        {/* Subtle background glow effect on right */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '45%',
            background: 'linear-gradient(90deg, rgba(239,246,255,0) 0%, rgba(219,234,254,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Student Avatar + Basic Identifiers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={student.avatar}
              alt={student.name}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
              }}
            />
            <button
              title="Change Photo"
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <h2
              style={{
                fontSize: '1.625rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 0.25rem 0',
                letterSpacing: '-0.01em',
              }}
            >
              {student.name}
            </h2>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              {student.rollNumber}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>
              {student.branch} &bull; {student.year} | {student.section}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#16a34a',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                }}
              >
                <CheckCircle2 size={13} />
                <span>{student.status}</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                }}
              >
                <Calendar size={13} />
                <span>{student.batch}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Right Artwork (CSS / Typography Recreated) */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="profile-quote-art"
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e3a8a',
                lineHeight: 1.2,
                transform: 'rotate(-2deg)',
              }}
            >
              Discipline today
            </div>
            <div
              style={{
                fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#2563eb',
                lineHeight: 1.2,
                transform: 'rotate(-2deg)',
              }}
            >
              Success tomorrow
            </div>
          </div>

          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 16px rgba(37,99,235,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              border: '1px solid #dbeafe',
            }}
          >
            <GraduationCap size={44} strokeWidth={1.75} />
          </div>
        </div>
      </div>

      {/* 3. Four Core Information Cards in 2x2 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
        }}
        className="profile-info-grid"
      >
        {/* Card 1: Personal Information */}
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
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <User size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Personal Information
              </h3>
            </div>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InfoRow label="Full Name" value={student.name} />
            <InfoRow label="Roll Number" value={student.rollNumber} />
            <InfoRow label="Date of Birth" value={student.dob} />
            <InfoRow label="Gender" value={student.gender} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Phone Number" value={student.phone} />
            <InfoRow label="Blood Group" value={student.bloodGroup} />
            <InfoRow label="Address" value={student.address} />
          </div>
        </div>

        {/* Card 2: Academic Information */}
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
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <GraduationCap size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Academic Information
              </h3>
            </div>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InfoRow label="Program" value={student.program} />
            <InfoRow label="Year" value={student.year} />
            <InfoRow label="Section" value={student.section} />
            <InfoRow label="Roll Number" value={student.rollNumber} />
            <InfoRow label="Admission Year" value={student.admissionYear} />
            <InfoRow label="Expected Graduation" value={student.expectedGraduation} />
            <InfoRow
              label="Current CGPA"
              value={
                <span
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  {student.cgpa}
                </span>
              }
            />
            <InfoRow label="Academic Advisor" value={student.advisor} />
            <InfoRow label="Department" value={student.department} />
          </div>
        </div>

        {/* Card 3: Contact Information */}
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
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Mail size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Contact Information
              </h3>
            </div>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InfoRow label="Personal Email" value={student.personalEmail} />
            <InfoRow label="College Email" value={student.collegeEmail} />
            <InfoRow label="Phone Number" value={student.contactPhone} />
            <InfoRow label="Alternate Number" value={student.alternatePhone} />
            <InfoRow label="Permanent Address" value={student.permanentAddress} />
          </div>
        </div>

        {/* Card 4: Emergency Contact */}
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
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Phone size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Emergency Contact
              </h3>
            </div>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InfoRow label="Parent/Guardian Name" value={student.guardianName} />
            <InfoRow label="Relationship" value={student.relationship} />
            <InfoRow label="Phone Number" value={student.guardianPhone} />
            <InfoRow label="Alternate Number" value={student.guardianAltPhone} />
            <InfoRow label="Address" value={student.guardianAddress} />
          </div>
        </div>
      </div>

      {/* 4. Achievements & Interests Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Trophy size={18} color="#2563eb" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Achievements &amp; Interests
            </h3>
          </div>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Achievements */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', minWidth: '110px' }}>
              Achievements
            </span>
            {student.achievements.map((item, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: idx === 0 ? '#fef3c7' : idx === 1 ? '#eff6ff' : '#f3e8ff',
                  color: idx === 0 ? '#92400e' : idx === 1 ? '#1d4ed8' : '#6b21a8',
                  border: `1px solid ${idx === 0 ? '#fde68a' : idx === 1 ? '#bfdbfe' : '#e9d5ff'}`,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '8px',
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Interests */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', minWidth: '110px' }}>
              Interests
            </span>
            {student.interests.map((item, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: idx === 0 ? '#ecfdf5' : idx === 1 ? '#eff6ff' : idx === 2 ? '#fdf2f8' : '#fff1f2',
                  color: idx === 0 ? '#065f46' : idx === 1 ? '#1e40af' : idx === 2 ? '#9d174d' : '#9f1239',
                  border: `1px solid ${idx === 0 ? '#a7f3d0' : idx === 1 ? '#bfdbfe' : idx === 2 ? '#fbcfe8' : '#fecdd3'}`,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '8px',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .profile-quote-art {
            display: none !important;
          }
          .profile-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Helper component for displaying label-value pairs with exact styling
 */
const InfoRow = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.8125rem',
    }}
  >
    <span style={{ color: '#64748b', fontWeight: 500, minWidth: '140px' }}>{label}</span>
    <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{value}</span>
  </div>
);

export default StudentProfilePage;
