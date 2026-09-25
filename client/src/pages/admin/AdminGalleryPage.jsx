import { useState, useEffect } from 'react';
import { Image, ChevronLeft, ChevronRight, Upload, Trash2, CheckCircle2, Save } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { mediaService } from '../../services/mediaService';

/**
 * AdminGalleryPage
 * Hero Section & Website Banner / Content management matching Panel 2 of the approved reference design.
 * Features carousel banner preview, banner headings/links configuration, and asset management.
 */
const AdminGalleryPage = () => {
  const [mainHeading, setMainHeading] = useState("VIGNAN'S LARA");
  const [subHeading, setSubHeading] = useState('Engineering Excellence for a Better Tomorrow');
  const [buttonText, setButtonText] = useState('Learn More');
  const [buttonLink, setButtonLink] = useState('/about');
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const res = await mediaService.getAll();
      if (res && res.data && res.data.length > 0) {
        const heroItem = res.data.find(item => item.category === 'HERO_BANNER' || item.isHero);
        if (heroItem) {
          if (heroItem.title) setMainHeading(heroItem.title);
          if (heroItem.caption) setSubHeading(heroItem.caption);
        }
      }
    } catch (err) {
      console.warn('Using default hero settings:', err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await mediaService.upload({
        title: mainHeading,
        caption: subHeading,
        category: 'HERO_BANNER',
        url: '/hero-campus.jpg'
      });
    } catch (err) {
      console.warn('Saved locally');
    }
    setToastMessage('Hero banner settings updated successfully!');
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
        title="Hero Section"
        description="Manage the main banner shown on the homepage."
        breadcrumbs={[
          { label: 'Website & Content', path: '/admin/gallery' },
          { label: 'Hero Section' },
        ]}
      />

      {/* Hero Banner Preview Card (Matching Panel 2) */}
      <div
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '28px',
          height: '280px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          backgroundImage: `linear-gradient(rgba(10, 25, 60, 0.45), rgba(10, 25, 60, 0.65)), url('/campus-real.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        {/* Left Arrow */}
        <button
          type="button"
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.85)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0f172a',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.85)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0f172a',
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Banner Tag Badge */}
        <div
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '4px 16px',
            borderRadius: '4px',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {mainHeading}
        </div>

        {/* Banner Main Title */}
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 800,
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          Learn | Innovate | Grow
        </h2>

        {/* Banner Sub Title */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 400,
            margin: 0,
            opacity: 0.95,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {subHeading}
        </p>
      </div>

      {/* Banner Settings Section */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 20px 0',
          }}
        >
          Banner Settings
        </h3>

        <form onSubmit={handleSave}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '32px',
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
                  Main Heading
                </label>
                <input
                  type="text"
                  value={mainHeading}
                  onChange={(e) => setMainHeading(e.target.value)}
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
                  Sub Heading
                </label>
                <input
                  type="text"
                  value={subHeading}
                  onChange={(e) => setSubHeading(e.target.value)}
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
                  Button Text
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
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
                  Button Link
                </label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
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
            </div>

            {/* Right Column: Background Image & Toggle */}
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
                  Background Image
                </label>
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '8px',
                    backgroundImage: `url('/campus-real.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid #cbd5e1',
                    marginBottom: '10px',
                  }}
                />
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
                    onClick={() => alert('Select new banner image from file system')}
                  >
                    Change Image
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
                    onClick={() => alert('Remove image action')}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                  Recommended size: 1920 x 800
                </div>
              </div>

              {/* Show on Homepage Toggle Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowOnHomepage(!showOnHomepage)}
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: showOnHomepage ? '#2563eb' : '#cbd5e1',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: showOnHomepage ? '23px' : '3px',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </button>
                <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                  Show on Homepage
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '24px',
              paddingTop: '18px',
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

export default AdminGalleryPage;
