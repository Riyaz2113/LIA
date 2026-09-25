import { useState } from 'react';
import { Settings, Bell, Lock, Shield, Eye, Save } from 'lucide-react';
import FacultyPageHeader from '../../components/faculty/FacultyPageHeader';

/**
 * FacultySettingsPage
 * Simple placeholder settings page matching the faculty theme.
 */
const FacultySettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    setToastMessage('✅ Preferences updated successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FacultyPageHeader
        title="Settings"
        subtitle="Manage your portal preferences and notification configurations."
      />

      {toastMessage && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            borderRadius: '10px',
            color: '#15803d',
            fontSize: '0.875rem',
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '2rem',
          maxWidth: '640px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
          Notification Preferences
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                Email Daily Digest
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Receive a morning summary of today's schedule and notices.
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                Instant Submission Alerts
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Get notified as soon as a student uploads an assignment.
              </div>
            </div>
            <input
              type="checkbox"
              checked={submissionAlerts}
              onChange={(e) => setSubmissionAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultySettingsPage;
