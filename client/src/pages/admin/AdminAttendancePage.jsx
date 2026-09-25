import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Percent, Calendar, Filter, Download } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import { ADMIN_ATTENDANCE_DATA } from '../../data/adminMockData';
import attendanceService from '../../services/attendanceService';

/**
 * AdminAttendancePage
 * Attendance analytics and department-wide attendance monitoring.
 */
const AdminAttendancePage = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedYear, setSelectedYear] = useState('All');
  const [attendanceData, setAttendanceData] = useState(ADMIN_ATTENDANCE_DATA);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await attendanceService.getOverview({ date: selectedDate });
        if (res.success && res.data) {
          setAttendanceData(res.data);
        }
      } catch {
        // Retain fallback data gracefully
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  const summary = attendanceData.summary || ADMIN_ATTENDANCE_DATA.summary;
  const departments = attendanceData.departments || ADMIN_ATTENDANCE_DATA.departments;

  const filteredDepts = departments.filter((dept) => {
    if (selectedDept !== 'All' && !dept.department.includes(selectedDept)) return false;
    return true;
  });

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <AdminPageHeader
        title="Attendance Overview"
        description="Monitor daily attendance rates across departments, sections, and academic years."
        breadcrumbs={[
          { label: 'Academics', path: '/admin/academics' },
          { label: 'Attendance' },
        ]}
        actionLabel="Export Report"
        actionIcon={Download}
        onAction={() => alert('Exporting attendance report as CSV/PDF')}
      />

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <AdminStatCard
          label="Total Enrolled"
          value={summary.totalStudents.toLocaleString()}
          change="All departments"
          isPositive={true}
          icon={Users}
          color="#2563eb"
          bg="#eff6ff"
        />
        <AdminStatCard
          label="Present Today"
          value={summary.presentToday.toLocaleString()}
          change="+1.4% vs yesterday"
          isPositive={true}
          icon={UserCheck}
          color="#16a34a"
          bg="#f0fdf4"
        />
        <AdminStatCard
          label="Absent Today"
          value={summary.absentToday.toLocaleString()}
          change="8.2% absent"
          isPositive={false}
          icon={UserX}
          color="#ef4444"
          bg="#fef2f2"
        />
        <AdminStatCard
          label="Average Attendance"
          value={summary.avgAttendance}
          change="+0.5% this week"
          isPositive={true}
          icon={Percent}
          color="#8b5cf6"
          bg="#f5f3ff"
        />
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            Filter by:
          </span>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginRight: '6px' }}>
            Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginRight: '6px' }}>
            Department:
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="AIML">AIML</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="ME">ME</option>
            <option value="IT">IT</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginRight: '6px' }}>
            Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              backgroundColor: '#f8fafc',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Years</option>
            <option value="I Year">I Year</option>
            <option value="II Year">II Year</option>
            <option value="III Year">III Year</option>
            <option value="IV Year">IV Year</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <AdminTable
        columns={[
          { key: 'department', label: 'Department / Branch' },
          { key: 'total', label: 'Total Enrolled', width: '130px' },
          { key: 'present', label: 'Present Today', width: '130px' },
          { key: 'absent', label: 'Absent Today', width: '130px' },
          { key: 'rate', label: 'Attendance Rate', width: '150px' },
          { key: 'status', label: 'Status', width: '120px' },
        ]}
        data={filteredDepts}
        totalItems={filteredDepts.length}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={() => {}}
        renderRow={(item, idx) => (
          <tr
            key={idx}
            style={{
              borderBottom: '1px solid #f1f5f9',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>
              {item.department}
            </td>
            <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13.5px' }}>
              {item.total}
            </td>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#16a34a', fontSize: '13.5px' }}>
              {item.present}
            </td>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#ef4444', fontSize: '13.5px' }}>
              {item.absent}
            </td>
            <td style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: item.rate,
                      backgroundColor:
                        parseFloat(item.rate) >= 90
                          ? '#10b981'
                          : parseFloat(item.rate) >= 80
                          ? '#f59e0b'
                          : '#ef4444',
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e293b', minWidth: '42px' }}>
                  {item.rate}
                </span>
              </div>
            </td>
            <td style={{ padding: '14px 16px' }}>
              <AdminStatusBadge
                status={item.status === 'High' ? 'Active' : item.status === 'Attention' ? 'Under Review' : 'Active'}
              />
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default AdminAttendancePage;
