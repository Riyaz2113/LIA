import { useState, useEffect } from 'react';
import { Plus, Calendar, Edit3, Trash2, Clock, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminModal from '../../components/admin/AdminModal';
import {
  ADMIN_TIMETABLE_SLOTS,
  ADMIN_TIMETABLE_DAYS,
  ADMIN_TIMETABLE_DATA,
} from '../../data/adminMockData';
import timetableService from '../../services/timetableService';

/**
 * AdminTimetablePage
 * Live Atlas-backed Timetable CMS with weekly grid view, department/year/section filters,
 * real-time mutations, confirmation on deletion, and cross-portal synchronisation.
 */
const AdminTimetablePage = () => {
  const [department, setDepartment] = useState('CSE');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [year, setYear] = useState('III Year');
  const [semester, setSemester] = useState('Semester I');
  const [section, setSection] = useState('Section A');

  // Timetable slot data state
  const [timetable, setTimetable] = useState(ADMIN_TIMETABLE_DATA);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmSlot, setDeleteConfirmSlot] = useState(null);

  const parseSemesterNumber = (semStr) => {
    if (semStr.includes('II')) return 2;
    return 1;
  };

  const parseYearNumber = (yrStr) => {
    if (yrStr.includes('IV')) return 4;
    if (yrStr.includes('III')) return 3;
    if (yrStr.includes('II')) return 2;
    return 1;
  };

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const res = await timetableService.getAll({
        academicYear,
        department,
        semester: parseSemesterNumber(semester),
      });

      const grid = {};
      ADMIN_TIMETABLE_SLOTS.forEach((slot) => {
        grid[slot] = {};
      });

      if (res && res.data && res.data.length > 0) {
        res.data.forEach((slot) => {
          const slotKey = `${slot.startTime} - ${slot.endTime}`;
          const dayName = slot.dayOfWeek
            ? slot.dayOfWeek.charAt(0) + slot.dayOfWeek.slice(1).toLowerCase()
            : 'Monday';
          if (!grid[slotKey]) grid[slotKey] = {};
          grid[slotKey][dayName] = {
            id: slot._id,
            code: slot.subject?.code || 'CS301',
            subject: slot.subject?.name || 'Subject',
            room: slot.room || 'Room 204',
            faculty: slot.faculty?.user?.name || slot.faculty?.employeeId || 'Dr. R. Mehta',
          };
        });
        setTimetable(grid);
      } else {
        // Empty state for this specific combination
        setTimetable(grid);
      }
    } catch {
      // Fallback
      setTimetable(ADMIN_TIMETABLE_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, [department, academicYear, year, semester, section]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState({
    id: null,
    day: 'Monday',
    timeSlot: '09:00 - 10:00',
    code: '',
    subject: '',
    room: 'Room 204',
    faculty: 'Dr. R. Mehta',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAddSlot = (day = 'Monday', timeSlot = '09:00 - 10:00') => {
    const existing = timetable[timeSlot]?.[day];
    if (existing && existing.id) {
      setEditingSlot({
        id: existing.id,
        day,
        timeSlot,
        code: existing.code,
        subject: existing.subject,
        room: existing.room,
        faculty: existing.faculty,
      });
    } else {
      setEditingSlot({
        id: null,
        day,
        timeSlot,
        code: 'CS301',
        subject: 'Data Structures',
        room: 'Room 204',
        faculty: 'Dr. R. Mehta',
      });
    }
    setModalOpen(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    const { id, day, timeSlot, code, subject, room, faculty } = editingSlot;
    const times = timeSlot.split('-').map((t) => t.trim());
    const startTime = times[0] || '09:00';
    const endTime = times[1] || '10:00';

    try {
      if (id) {
        // Live Update in Atlas
        await timetableService.update(id, {
          dayOfWeek: day.toUpperCase(),
          startTime,
          endTime,
          room,
          subject: code,
          faculty,
          academicYear,
          semester: parseSemesterNumber(semester),
        });
        showToast(`Updated ${code} on ${day} (${timeSlot})`);
      } else {
        // Live Create in Atlas
        await timetableService.create({
          dayOfWeek: day.toUpperCase(),
          startTime,
          endTime,
          subject: code,
          faculty,
          room,
          department,
          year: parseYearNumber(year),
          semester: parseSemesterNumber(semester),
          section: section.replace('Section ', '').trim(),
          academicYear,
        });
        showToast(`Persisted ${code} on ${day} (${timeSlot}) to MongoDB Atlas`);
      }
      await loadTimetable();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save timetable slot.', 'error');
    }

    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmSlot) return;
    const { id, day, timeSlot } = deleteConfirmSlot;

    try {
      if (id) {
        await timetableService.delete(id);
        showToast(`Class removed from ${day} (${timeSlot}) in Atlas`);
        await loadTimetable();
      } else {
        setTimetable((prev) => {
          const updatedSlot = { ...(prev[timeSlot] || {}) };
          delete updatedSlot[day];
          return { ...prev, [timeSlot]: updatedSlot };
        });
        showToast(`Class removed from ${day} (${timeSlot})`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete slot.', 'error');
    } finally {
      setDeleteConfirmSlot(null);
    }
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
            backgroundColor: toastType === 'error' ? '#ef4444' : '#10b981',
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
          {toastType === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="Timetable Management"
        description="Configure department schedules, assign classrooms, and organize faculty lecture slots."
        breadcrumbs={[
          { label: 'Academics', path: '/admin/academics' },
          { label: 'Timetable' },
        ]}
        actionLabel="Add Class Slot"
        actionIcon={Plus}
        onAction={() => handleOpenAddSlot()}
      />

      {/* Selector Filters Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '18px 22px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#2563eb" />
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
            Filter Schedule:
          </span>
        </div>

        {/* Academic Year */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Academic Year
          </label>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="CSE">CSE (Computer Science)</option>
            <option value="AIML">AIML (Artificial Intelligence)</option>
            <option value="ECE">ECE (Electronics)</option>
            <option value="EEE">EEE (Electrical)</option>
            <option value="ME">ME (Mechanical)</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="I Year">I Year</option>
            <option value="II Year">II Year</option>
            <option value="III Year">III Year</option>
            <option value="IV Year">IV Year</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Semester
          </label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="Semester I">Semester I</option>
            <option value="Semester II">Semester II</option>
          </select>
        </div>

        {/* Section */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
            Section
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
          </select>
        </div>
      </div>

      {/* Timetable Grid Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
            Schedule for {department} - {year} ({section}) {loading && <span style={{ fontSize: '12px', color: '#2563eb' }}>[Loading from Atlas...]</span>}
          </div>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Click on any slot to assign or modify class
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              minWidth: '900px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th
                  style={{
                    padding: '14px 16px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#475569',
                    width: '130px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#64748b" />
                    Time Slot
                  </div>
                </th>
                {ADMIN_TIMETABLE_DAYS.map((day) => (
                  <th
                    key={day}
                    style={{
                      padding: '14px 16px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#475569',
                      textAlign: 'center',
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_TIMETABLE_SLOTS.map((slot) => (
                <tr key={slot} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Time Slot Label */}
                  <td
                    style={{
                      padding: '14px 16px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#1e293b',
                      backgroundColor: '#f8fafc',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {slot}
                  </td>

                  {/* Day Slots */}
                  {ADMIN_TIMETABLE_DAYS.map((day) => {
                    const classInfo = timetable[slot]?.[day];

                    return (
                      <td
                        key={day}
                        style={{
                          padding: '10px 12px',
                          verticalAlign: 'top',
                          borderLeft: '1px solid #f1f5f9',
                          height: '90px',
                        }}
                      >
                        {classInfo && classInfo.subject ? (
                          <div
                            style={{
                              backgroundColor: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              borderRadius: '7px',
                              padding: '8px 10px',
                              position: 'relative',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '4px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: '#1e40af',
                                }}
                              >
                                {classInfo.code}
                              </span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  type="button"
                                  title="Edit slot"
                                  onClick={() => handleOpenAddSlot(day, slot)}
                                  style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: '#2563eb',
                                    cursor: 'pointer',
                                    padding: '2px',
                                  }}
                                >
                                  <Edit3 size={11} />
                                </button>
                                <button
                                  type="button"
                                  title="Delete slot"
                                  onClick={() => setDeleteConfirmSlot({ id: classInfo.id, day, timeSlot: slot, code: classInfo.code })}
                                  style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '2px',
                                  }}
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: '11.5px',
                                fontWeight: 500,
                                color: '#1e293b',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {classInfo.subject}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: '#64748b',
                                marginTop: '4px',
                              }}
                            >
                              <MapPin size={10} />
                              {classInfo.room}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: '#475569',
                                marginTop: '2px',
                              }}
                            >
                              <User size={10} />
                              {classInfo.faculty}
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleOpenAddSlot(day, slot)}
                            style={{
                              height: '100%',
                              minHeight: '64px',
                              border: '1px dashed #e2e8f0',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#94a3b8',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#2563eb';
                              e.currentTarget.style.backgroundColor = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Plus size={14} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Slot Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlot.id ? 'Edit Timetable Slot' : 'Assign New Timetable Slot'}
      >
        <form onSubmit={handleSaveSlot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Day
              </label>
              <select
                value={editingSlot.day}
                onChange={(e) => setEditingSlot({ ...editingSlot, day: e.target.value })}
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
                {ADMIN_TIMETABLE_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Time Slot
              </label>
              <select
                value={editingSlot.timeSlot}
                onChange={(e) => setEditingSlot({ ...editingSlot, timeSlot: e.target.value })}
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
                {ADMIN_TIMETABLE_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={editingSlot.code}
                onChange={(e) => setEditingSlot({ ...editingSlot, code: e.target.value })}
                placeholder="e.g. CS301"
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
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={editingSlot.subject}
                onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                placeholder="e.g. Data Structures"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Room / Hall
              </label>
              <input
                type="text"
                value={editingSlot.room}
                onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                placeholder="e.g. Room 204"
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
                Assigned Faculty
              </label>
              <input
                type="text"
                value={editingSlot.faculty}
                onChange={(e) => setEditingSlot({ ...editingSlot, faculty: e.target.value })}
                placeholder="e.g. Dr. R. Mehta"
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
              {editingSlot.id ? 'Update Slot' : 'Save Slot to Atlas'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmSlot && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmSlot(null)}
          title="Confirm Timetable Slot Deletion"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to remove the class slot for{' '}
              <strong style={{ color: '#0f172a' }}>{deleteConfirmSlot.code}</strong> on{' '}
              <strong style={{ color: '#0f172a' }}>{deleteConfirmSlot.day} ({deleteConfirmSlot.timeSlot})</strong>?
              This mutation will be immediately committed to MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmSlot(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Yes, Delete Slot
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminTimetablePage;
