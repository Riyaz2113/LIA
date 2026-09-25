import { useState, useEffect } from 'react';
import { Plus, Award, Calendar, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { ADMIN_EXAMS_DATA } from '../../data/adminMockData';
import examService from '../../services/examService';
import markService from '../../services/markService';

/**
 * AdminExamsPage
 * Examinations & results administration with Schedule and Results tabs.
 */
const AdminExamsPage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [exams, setExams] = useState(ADMIN_EXAMS_DATA);
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sample results data
  const [results, setResults] = useState([
    { id: 1, rollNo: '21BCS101', student: 'Rahul Kumar', subject: 'CS301 Data Structures', marks: '88/100', grade: 'A+', status: 'Pass' },
    { id: 2, rollNo: '21BCS102', student: 'Sneha Reddy', subject: 'CS301 Data Structures', marks: '92/100', grade: 'O', status: 'Pass' },
    { id: 3, rollNo: '21BCS103', student: 'Aditya Kumar', subject: 'CS301 Data Structures', marks: '74/100', grade: 'B+', status: 'Pass' },
    { id: 4, rollNo: '21BCS104', student: 'Kavya Sri', subject: 'CS301 Data Structures', marks: '81/100', grade: 'A', status: 'Pass' },
    { id: 5, rollNo: '21BCS105', student: 'Mohd. Ayaan', subject: 'CS301 Data Structures', marks: '65/100', grade: 'B', status: 'Pass' },
  ]);

  const loadExamsAndResults = async () => {
    try {
      const [eRes, mRes] = await Promise.all([
        examService.getAll(),
        markService.getAll(),
      ]);

      if (eRes.success && eRes.data && eRes.data.length > 0) {
        const mappedExams = eRes.data.map((ex) => ({
          id: ex._id || ex.id,
          exam: ex.name || 'Mid-Term Exam',
          subject: ex.subject?.name ? `${ex.subject.code} - ${ex.subject.name}` : 'CS301 Data Structures',
          department: ex.subject?.department?.code || 'CSE',
          semester: `Semester ${ex.semester || 1}`,
          date: ex.date ? new Date(ex.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '10 Oct 2026',
          time: `${ex.startTime || '10:00 AM'} - ${ex.endTime || '12:00 PM'}`,
          room: ex.room || 'Hall A',
          status: ex.status === 'SCHEDULED' ? 'Scheduled' : 'Active',
        }));
        setExams(mappedExams);
      }

      if (mRes.success && mRes.data && mRes.data.length > 0) {
        const mappedMarks = mRes.data.map((m, idx) => ({
          id: m._id || idx + 1,
          rollNo: m.student?.rollNumber || '21BCS101',
          student: m.student?.user?.name || 'Rahul Kumar',
          subject: m.subject?.name || 'Data Structures',
          marks: `${m.marks}/${m.maxMarks}`,
          grade: m.grade || 'A+',
          status: m.grade !== 'F' ? 'Pass' : 'Fail',
        }));
        setResults(mappedMarks);
      }
    } catch {
      // Retain fallback data gracefully
    }
  };

  useEffect(() => {
    loadExamsAndResults();
  }, []);

  const [editingExamId, setEditingExamId] = useState(null);

  const [formData, setFormData] = useState({
    exam: 'Mid-Term Exam I',
    subject: '',
    date: '',
    time: '10:00 AM - 12:00 PM',
    room: 'Hall A',
    department: 'CSE',
    semester: 'III Year',
    status: 'Scheduled',
  });

  const tabs = [
    { id: 'schedule', name: 'Exam Schedule' },
    { id: 'results', name: 'Results & Grades' },
  ];

  const filteredExams = exams.filter((e) => {
    if (deptFilter !== 'All' && e.department !== deptFilter) return false;
    if (
      searchQuery &&
      !e.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.exam.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleEditExam = (exam) => {
    setEditingExamId(exam.id);
    setFormData({
      exam: exam.exam || 'Mid-Term Exam I',
      subject: exam.subject || '',
      date: exam.date || '',
      time: exam.time || '10:00 AM - 12:00 PM',
      room: exam.room || 'Hall A',
      department: exam.department || 'CSE',
      semester: exam.semester || 'III Year',
      status: exam.status || 'Scheduled',
    });
    setModalOpen(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!formData.subject) return;

    if (editingExamId) {
      try {
        await examService.update(editingExamId, {
          name: formData.exam,
          subject: formData.subject,
          date: formData.date,
          startTime: formData.time.split('-')[0]?.trim() || '10:00',
          endTime: formData.time.split('-')[1]?.trim() || '12:00',
          room: formData.room,
        });
        await loadExamsAndResults();
      } catch {
        setExams(exams.map((x) => (x.id === editingExamId ? { ...x, ...formData } : x)));
      }
      setToastMessage('✅ Examination details updated successfully!');
    } else {
      try {
        await examService.create({
          name: formData.exam,
          subject: formData.subject,
          date: formData.date,
          startTime: formData.time.split('-')[0]?.trim() || '10:00',
          endTime: formData.time.split('-')[1]?.trim() || '12:00',
          room: formData.room,
        });
        await loadExamsAndResults();
      } catch {
        const newExam = {
          id: Date.now(),
          ...formData,
        };
        setExams([newExam, ...exams]);
      }
      setToastMessage(`✅ Exam scheduled for ${formData.subject}`);
    }

    setModalOpen(false);
    setEditingExamId(null);
    setFormData({
      exam: 'Mid-Term Exam I',
      subject: '',
      date: '',
      time: '10:00 AM - 12:00 PM',
      room: 'Hall A',
      department: 'CSE',
      semester: 'III Year',
      status: 'Scheduled',
    });
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDeleteExam = async (id) => {
    try {
      await examService.delete(id);
      await loadExamsAndResults();
    } catch {
      setExams(exams.filter((x) => x.id !== id));
    }
    setToastMessage('Exam removed from schedule');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
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
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '13.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="Exams & Results"
        description="Schedule mid-term & semester examinations, assign exam halls, and review student grades."
        breadcrumbs={[
          { label: 'Academics', path: '/admin/academics' },
          { label: 'Exams & Results' },
        ]}
        actionLabel={activeTab === 'schedule' ? 'Schedule Exam' : 'Publish Results'}
        actionIcon={Plus}
        onAction={() => {
          if (activeTab === 'schedule') setModalOpen(true);
          else alert('Publish results modal');
        }}
      />

      {/* Tabs */}
      <AdminTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Filters */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={activeTab === 'schedule' ? 'Search exam or subject...' : 'Search student or subject...'}
        filters={[
          {
            name: 'dept',
            value: deptFilter,
            onChange: setDeptFilter,
            options: [
              { value: 'All', label: 'All Departments' },
              { value: 'CSE', label: 'CSE' },
              { value: 'AIML', label: 'AIML' },
              { value: 'ECE', label: 'ECE' },
              { value: 'EEE', label: 'EEE' },
            ],
          },
        ]}
      />

      {/* Tab Content */}
      {activeTab === 'schedule' ? (
        <AdminTable
          columns={[
            { key: 'exam', label: 'Exam Title', width: '160px' },
            { key: 'subject', label: 'Subject' },
            { key: 'department', label: 'Department', width: '120px' },
            { key: 'date', label: 'Date', width: '130px' },
            { key: 'time', label: 'Time Slot', width: '170px' },
            { key: 'room', label: 'Hall / Lab', width: '120px' },
            { key: 'status', label: 'Status', width: '110px' },
            { key: 'actions', label: 'Actions', width: '100px' },
          ]}
          data={filteredExams}
          totalItems={filteredExams.length}
          itemsPerPage={10}
          currentPage={1}
          onPageChange={() => {}}
          renderRow={(exam) => (
            <tr
              key={exam.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e40af', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#2563eb" />
                  {exam.exam}
                </div>
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 500, color: '#0f172a', fontSize: '13.5px' }}>
                {exam.subject}
              </td>
              <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>
                {exam.department} - {exam.semester}
              </td>
              <td style={{ padding: '14px 16px', color: '#1e293b', fontSize: '13px', fontWeight: 500 }}>
                {exam.date}
              </td>
              <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12.5px' }}>
                {exam.time}
              </td>
              <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#334155',
                  }}
                >
                  {exam.room}
                </span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <AdminStatusBadge status={exam.status} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    title="Edit Exam"
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#2563eb',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleEditExam(exam)}
                  >
                    <Edit3 size={14} color="#2563eb" />
                  </button>
                  <button
                    type="button"
                    title="Delete Exam"
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteExam(exam.id)}
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      ) : (
        <AdminTable
          columns={[
            { key: 'rollNo', label: 'Roll Number', width: '130px' },
            { key: 'student', label: 'Student Name' },
            { key: 'subject', label: 'Subject' },
            { key: 'marks', label: 'Marks Obtained', width: '140px' },
            { key: 'grade', label: 'Grade', width: '100px' },
            { key: 'status', label: 'Result', width: '110px' },
          ]}
          data={results}
          totalItems={results.length}
          itemsPerPage={10}
          currentPage={1}
          onPageChange={() => {}}
          renderRow={(res) => (
            <tr
              key={res.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e40af', fontSize: '13px' }}>
                {res.rollNo}
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 500, color: '#0f172a', fontSize: '13.5px' }}>
                {res.student}
              </td>
              <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>
                {res.subject}
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>
                {res.marks}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  {res.grade}
                </span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <AdminStatusBadge status={res.status === 'Pass' ? 'Active' : 'Rejected'} />
              </td>
            </tr>
          )}
        />
      )}

      {/* Add / Edit Exam Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingExamId(null);
        }}
        title={editingExamId ? 'Edit Examination Schedule' : 'Schedule New Examination'}
      >
        <form onSubmit={handleSaveExam} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Examination Title *
            </label>
            <input
              type="text"
              required
              value={formData.exam}
              onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Subject *
            </label>
            <input
              type="text"
              placeholder="e.g. CS305 - Web Technologies"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Time Slot
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="CSE">CSE</option>
                <option value="AIML">AIML</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Year
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="I Year">I Year</option>
                <option value="II Year">II Year</option>
                <option value="III Year">III Year</option>
                <option value="IV Year">IV Year</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Hall / Room
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '8px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              {editingExamId ? 'Save Changes' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminExamsPage;
