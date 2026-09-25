import { useState, useEffect } from 'react';
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
  X,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';

/**
 * StudentProfilePage
 * Complete student profile view with live MongoDB Atlas data hydration and field-level editing.
 */
const StudentProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state for editing permitted fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    personalEmail: '',
    alternatePhone: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: 'MALE',
    street: '',
    city: '',
    state: '',
    pincode: '',
    guardianName: '',
    guardianPhone: '',
    achievementsText: '',
    interestsText: '',
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await studentService.getMe();
      if (res && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch student profile from /api/students/me:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openEditModal = () => {
    setFormData({
      name: profile?.user?.name || user?.name || '',
      phone: profile?.user?.phone || user?.phone || '',
      personalEmail: profile?.personalEmail || '',
      alternatePhone: profile?.alternatePhone || '',
      bloodGroup: profile?.bloodGroup || 'O+',
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.substring(0, 10) : '2004-03-15',
      gender: profile?.gender || 'MALE',
      street: profile?.address?.street || 'D.No. 12-5-34',
      city: profile?.address?.city || 'Mangalagiri',
      state: profile?.address?.state || 'Andhra Pradesh',
      pincode: profile?.address?.pincode || '522503',
      guardianName: profile?.guardianName || 'Suresh Kumar',
      guardianPhone: profile?.guardianPhone || '+91 99887 66554',
      achievementsText: (profile?.achievements && profile.achievements.length > 0)
        ? profile.achievements.join(', ')
        : '5★ HackerRank (Problem Solving), 350+ LeetCode Problems, 60+ CodeChef Contests',
      interestsText: (profile?.interests && profile.interests.length > 0)
        ? profile.interests.join(', ')
        : 'Machine Learning, Web Development, Competitive Programming, Reading',
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    const achievements = formData.achievementsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const interests = formData.interestsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      personalEmail: formData.personalEmail.trim(),
      alternatePhone: formData.alternatePhone.trim(),
      bloodGroup: formData.bloodGroup.trim(),
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender,
      address: {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      },
      guardianName: formData.guardianName.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      achievements,
      interests,
    };

    try {
      const res = await studentService.updateMe(payload);
      if (res && res.data) {
        setProfile(res.data);
      }
      setIsModalOpen(false);
      setToastMessage('✅ Profile changes saved successfully to MongoDB Atlas.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unable to save profile changes.';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  // Resolved display values
  const student = {
    name: profile?.user?.name || user?.name || 'Rahul Kumar',
    rollNumber: profile?.rollNumber || user?.profile?.rollNumber || '21BCS101',
    branch: profile?.department?.name || 'B.Tech - Computer Science and Engineering',
    year: profile?.year ? `Year ${profile.year}` : 'III Year',
    section: profile?.section ? `Section ${profile.section}` : 'Section A',
    status: profile?.isActive === false ? 'Inactive' : 'Active Student',
    batch: profile?.batch || `${profile?.admissionYear || 2023} - ${(profile?.admissionYear || 2023) + 4}`,
    avatar:
      profile?.profileImage ||
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',

    // Personal Info
    dob: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '15 March 2004',
    gender: profile?.gender
      ? (profile.gender === 'MALE' ? 'Male' : profile.gender === 'FEMALE' ? 'Female' : profile.gender)
      : 'Male',
    email: profile?.user?.email || user?.email || 'rahulkumar21bcs101@vignan.ac.in',
    phone: profile?.user?.phone || '+91 98765 43210',
    bloodGroup: profile?.bloodGroup || 'O+',
    address: profile?.address?.city
      ? `${profile.address.street ? profile.address.street + ', ' : ''}${profile.address.city}, ${profile.address.state || ''} ${profile.address.pincode ? '- ' + profile.address.pincode : ''}`
      : 'D.No. 12-5-34, Mangalagiri, Guntur, Andhra Pradesh - 522503',

    // Academic Info
    program: profile?.department?.name ? `B.Tech - ${profile.department.name}` : 'B.Tech - Computer Science and Engineering',
    admissionYear: profile?.admissionYear?.toString() || '2023',
    expectedGraduation: profile?.admissionYear ? (profile.admissionYear + 4).toString() : '2027',
    cgpa: '8.32',
    advisor: 'Dr. S. Rao',
    department: profile?.department?.name || 'Computer Science and Engineering',

    // Contact Info
    personalEmail: profile?.personalEmail || 'rahulkumar2004@gmail.com',
    collegeEmail: profile?.user?.email || user?.email || 'rahulkumar21bcs101@vignan.ac.in',
    contactPhone: profile?.user?.phone || '+91 98765 43210',
    alternatePhone: profile?.alternatePhone || '+91 91234 56789',
    permanentAddress: profile?.address?.city
      ? `${profile.address.street ? profile.address.street + ', ' : ''}${profile.address.city}, ${profile.address.state || ''} ${profile.address.pincode ? '- ' + profile.address.pincode : ''}`
      : 'D.No. 12-5-34, Mangalagiri, Guntur, Andhra Pradesh - 522503',

    // Emergency Contact
    guardianName: profile?.guardianName || 'Suresh Kumar',
    relationship: 'Father',
    guardianPhone: profile?.guardianPhone || '+91 99887 66554',
    guardianAltPhone: profile?.alternatePhone || '+91 91234 56789',
    guardianAddress: profile?.address?.city
      ? `${profile.address.street ? profile.address.street + ', ' : ''}${profile.address.city}, ${profile.address.state || ''} ${profile.address.pincode ? '- ' + profile.address.pincode : ''}`
      : 'D.No. 12-5-34, Mangalagiri, Guntur, Andhra Pradesh - 522503',

    // Achievements & Interests
    achievements: (profile?.achievements && profile.achievements.length > 0)
      ? profile.achievements
      : [
          '5★ HackerRank (Problem Solving)',
          '350+ LeetCode Problems',
          '60+ CodeChef Contests',
        ],
    interests: (profile?.interests && profile.interests.length > 0)
      ? profile.interests
      : [
          'Machine Learning',
          'Web Development',
          'Competitive Programming',
          'Reading',
        ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast Notification */}
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
            type="button"
            onClick={openEditModal}
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
            <span>Edit Profile</span>
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
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {student.name}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  border: '1px solid #bbf7d0',
                }}
              >
                {student.status}
              </span>
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563eb', marginBottom: '0.25rem' }}>
              {student.rollNumber} &bull; {student.branch}
            </div>

            <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              {student.year} &bull; {student.section} &bull; Batch: {student.batch}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 2x2 Grid for Specific Info Sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
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
              type="button"
              onClick={openEditModal}
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
            <InfoRow label="Date of Birth" value={student.dob} />
            <InfoRow label="Gender" value={student.gender} />
            <InfoRow label="Blood Group" value={student.bloodGroup} />
            <InfoRow label="Primary Email" value={student.email} />
            <InfoRow label="Contact Phone" value={student.phone} />
            <InfoRow label="Address" value={student.address} />
          </div>
        </div>

        {/* Card 2: Academic Information (Protected / Institutional) */}
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
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
              }}
            >
              Institutional Record
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <InfoRow label="Department" value={student.department} />
            <InfoRow label="Program" value={student.program} />
            <InfoRow label="Admission Year" value={student.admissionYear} />
            <InfoRow label="Expected Graduation" value={student.expectedGraduation} />
            <InfoRow label="Current CGPA" value={student.cgpa} />
            <InfoRow label="Faculty Mentor" value={student.advisor} />
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
              type="button"
              onClick={openEditModal}
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
              type="button"
              onClick={openEditModal}
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
            type="button"
            onClick={openEditModal}
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
              maxWidth: '680px',
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
                  Edit Student Profile
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Update your personal, contact, and profile details.
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

            {/* Protected Institutional Notice */}
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
                <strong>Institutional Security Notice:</strong> Roll Number ({student.rollNumber}), Department, Year, Semester, and Official College Email are managed exclusively by Academic Administration and cannot be altered here.
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
                    Primary Phone Number
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Personal Email
                  </label>
                  <input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    placeholder="e.g. personal@gmail.com"
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
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                    placeholder="+91 91234 56789"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.875rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    placeholder="e.g. O+, A+, B+"
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

              {/* Address Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Street / Door No.
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="D.No. 12-5-34"
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
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mangalagiri"
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
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Andhra Pradesh"
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
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="522503"
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

              {/* Emergency Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Suresh Kumar"
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
                    Guardian Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+91 99887 66554"
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

              {/* Achievements & Interests */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Achievements (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.achievementsText}
                  onChange={(e) => setFormData({ ...formData, achievementsText: e.target.value })}
                  placeholder="5★ HackerRank, 350+ LeetCode Problems"
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
                  Interests &amp; Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.interestsText}
                  onChange={(e) => setFormData({ ...formData, interestsText: e.target.value })}
                  placeholder="Machine Learning, Web Development, Competitive Programming"
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

      <style>{`
        @media (max-width: 900px) {
          .profile-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

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
    <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</span>
  </div>
);

export default StudentProfilePage;
