import { useState } from 'react';
import { Save, CheckCircle2, Building, Mail, Globe, Shield, Terminal } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import { ADMIN_SETTINGS_DATA } from '../../data/adminMockData';

/**
 * AdminSettingsPage
 * Institute configuration and preferences matching Panel 9 of the approved reference design.
 * Features tabs (Institute Details, Contact, Social Media, Email Settings, System),
 * institute details form fields, institute logo preview & actions, and Save Settings.
 */
const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Institute Details');
  const [formData, setFormData] = useState(ADMIN_SETTINGS_DATA);
  const [toastMessage, setToastMessage] = useState('');

  const tabs = [
    { id: 'Institute Details', name: 'Institute Details' },
    { id: 'Contact', name: 'Contact' },
    { id: 'Social Media', name: 'Social Media' },
    { id: 'Email Settings', name: 'Email Settings' },
    { id: 'System', name: 'System' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Institute settings saved successfully!');
    setTimeout(() => setToastMessage(''), 3500);
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
        title="General Settings"
        description="Configure basic institute information and preferences."
        breadcrumbs={[
          { label: 'Administration', path: '/admin/settings' },
          { label: 'Settings' },
        ]}
      />

      {/* Settings Navigation Tabs */}
      <AdminTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Settings Card (Matching Panel 9) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <form onSubmit={handleSave}>
          {activeTab === 'Institute Details' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '36px',
                alignItems: 'start',
              }}
            >
              {/* Left Column: Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Institute Name
                  </label>
                  <input
                    type="text"
                    value={formData.instituteName}
                    onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Short Name
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Logo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#334155',
                  }}
                >
                  Institute Logo
                </label>

                <div
                  style={{
                    width: '100%',
                    height: '110px',
                    borderRadius: '8px',
                    border: '1px dashed #cbd5e1',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: '#1e3a8a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '15px',
                      }}
                    >
                      LIA
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                        LIA
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
                        Vignan's Lara Institute of Technology & Science
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#2563eb',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => alert('Select new logo image')}
                  >
                    Change Logo
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#ef4444',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => alert('Remove logo action')}
                  >
                    Remove
                  </button>
                </div>

                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Recommended size: 300 x 100
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Official Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'Social Media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  defaultValue="https://linkedin.com/school/vignan-lara"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  YouTube Channel
                </label>
                <input
                  type="text"
                  defaultValue="https://youtube.com/@vignanlaraofficial"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'Email Settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  SMTP Host
                </label>
                <input
                  type="text"
                  defaultValue="smtp.gmail.com"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  SMTP Port
                </label>
                <input
                  type="text"
                  defaultValue="587"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'System' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '600px' }}>
              <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>LIA Platform Version</div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>v2.4.0 (Enterprise Build 2026.09)</div>
              </div>
              <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>Database Engine</div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>MongoDB Atlas 7.0 (MERN Architecture)</div>
              </div>
            </div>
          )}

          {/* Bottom Action Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
              }}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
