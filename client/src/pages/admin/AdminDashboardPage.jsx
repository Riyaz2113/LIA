import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  FileText,
  Briefcase,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { ADMIN_DASHBOARD_DATA } from '../../data/adminMockData';
import dashboardService from '../../services/dashboardService';

/**
 * AdminDashboardPage
 * Admin portal main dashboard matching the approved reference design.
 * Features welcome greeting, 4 key metric stat cards, campus building banner,
 * Recent Activities feed, and Pending Approvals list.
 */
const AdminDashboardPage = () => {
  const [data, setData] = useState(ADMIN_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getAdminStats();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        // Retain fallback data gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data.stats || ADMIN_DASHBOARD_DATA.stats;
  const recentActivities = data.recentActivities || ADMIN_DASHBOARD_DATA.recentActivities;
  const pendingApprovals = data.pendingApprovals || ADMIN_DASHBOARD_DATA.pendingApprovals;

  const getStatIcon = (label) => {
    switch (label) {
      case 'Students':
        return GraduationCap;
      case 'Faculty':
        return UserCheck;
      case 'Programs':
        return BookOpen;
      case 'Departments':
      default:
        return Building2;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'student':
        return GraduationCap;
      case 'faculty':
        return UserCheck;
      case 'placement':
        return Briefcase;
      case 'notice':
      default:
        return FileText;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Welcome Greeting Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.25rem 0',
            }}
          >
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Welcome back, <span style={{ color: '#2563eb', fontWeight: 600 }}>Administrator</span> &mdash; Vignan&apos;s Lara Institute of Technology &amp; Science
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#475569',
            }}
          >
            <Calendar size={15} color="#2563eb" />
            <span>Mon, Sep 15, 2026</span>
          </div>

          <Link
            to="/chat"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            <span>Ask LIA Assistant</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 2. Four Statistic Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {stats.map((s, idx) => (
          <AdminStatCard
            key={idx}
            label={s.label}
            value={s.value}
            change={s.change}
            isPositive={s.isPositive}
            icon={getStatIcon(s.label)}
            color={s.color}
            bg={s.bg}
          />
        ))}
      </div>

      {/* 3. Main Split Section (65% / 35%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem',
        }}
        className="admin-dashboard-grid"
      >
        {/* Left Column (65%): Campus Photo Banner + Recent Activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Campus Monument Hero Visual Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              position: 'relative',
              height: '200px',
            }}
          >
            <img
              src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_57_26 PM.png"
              alt="Vignan's Lara Institute of Technology & Science"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Subtle Overlay Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '16px',
                backgroundColor: 'rgba(7, 17, 38, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Vignan&apos;s Lara Institute of Technology &amp; Science
            </div>
          </div>

          {/* Recent Activities Card */}
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
              }}
            >
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Recent Activities
              </h3>
              <Link
                to="/admin/audit-logs"
                style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
              >
                View All &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {recentActivities.map((act) => {
                const Icon = getActivityIcon(act.type);
                return (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                        {act.title}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (35%): Pending Approvals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
              }}
            >
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Pending Approvals
              </h3>
              <Link
                to="/admin/users"
                style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
              >
                View All &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {pendingApprovals.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    textDecoration: 'none',
                    transition: 'all 150ms ease',
                  }}
                  className="admin-approval-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        color: '#2563eb',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        minWidth: '32px',
                        textAlign: 'center',
                      }}
                    >
                      {item.count}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight size={16} color="#94a3b8" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-dashboard-grid {
            grid-template-columns: 1.45fr 0.85fr !important;
          }
        }
        .admin-approval-row:hover {
          background-color: #eff6ff !important;
          border-color: #bfdbfe !important;
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
