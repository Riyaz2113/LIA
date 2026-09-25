import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X } from 'lucide-react';

/**
 * HeroSection
 * Full-width panoramic background hero section matching the approved reference design.
 * Real campus photograph extends full-width across the background with smooth gradient overlay.
 * Includes interactive "Watch Video" modal playing the official Google Drive campus video.
 */
const HeroSection = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Close modal on Escape key press and manage body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsVideoModalOpen(false);
      }
    };

    if (isVideoModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isVideoModalOpen]);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderBottom: '1px solid #f1f5f9',
      }}
      className="lia-fullwidth-hero"
    >
      {/* 1. Full-Width Panoramic Campus Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <img
          src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_57_26 PM.png"
          alt="Vignan's Lara Institute of Technology & Science Campus Building"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
            display: 'block',
          }}
          className="hero-bg-photo"
        />

        {/* Smooth Left Gradient Overlay for Text Readability & Natural Campus Photo Reveal */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background:
              'linear-gradient(90deg, #ffffff 0%, #ffffff 22%, rgba(255, 255, 255, 0.96) 30%, rgba(255, 255, 255, 0.75) 38%, rgba(255, 255, 255, 0.25) 46%, rgba(255, 255, 255, 0) 56%)',
            pointerEvents: 'none',
          }}
          className="hero-left-gradient"
        />
      </div>

      {/* 2. Content Overlay Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 2rem 4.5rem 2rem',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        className="hero-content-wrapper"
      >
        {/* Slogan Banner Pill */}
        <div
          style={{
            position: 'absolute',
            top: '1.75rem',
            right: '2rem',
            zIndex: 10,
          }}
          className="hero-slogan-container"
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.45rem 1.125rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            A UNIT OF VIGNAN GROUP
          </div>
        </div>

        {/* Left-Aligned Main Hero Typography & Call-to-Action */}
        <div
          style={{
            maxWidth: '620px',
            position: 'relative',
            zIndex: 3,
          }}
        >
          {/* Welcome Badge Tag */}
          <div
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 800,
              color: '#2563eb',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            WELCOME TO
          </div>

          {/* Main Title Heading */}
          <h1
            style={{
              fontSize: '2.875rem',
              fontWeight: 800,
              lineHeight: 1.12,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
            }}
            className="hero-main-title"
          >
            Lara Intelligent <br />
            Assistant <span style={{ color: '#2563eb' }}>(LIA)</span>
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1e293b',
              lineHeight: 1.45,
              marginBottom: '0.875rem',
            }}
            className="hero-sub-title"
          >
            Your Smart Gateway to a Connected, <br className="hero-sub-break" />
            <span
              style={{
                borderBottom: '2px solid #93c5fd',
                paddingBottom: '2px',
              }}
            >
              Informed and Empowered Campus.
            </span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '0.9375rem',
              color: '#475569',
              lineHeight: 1.55,
              marginBottom: '1.875rem',
              maxWidth: '520px',
            }}
          >
            Access academic resources, notifications, events, placements and more &mdash; all in
            one place.
          </p>

          {/* Call-to-Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Primary Get Started Button */}
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.875rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                transition: 'all 160ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={18} strokeWidth={2.4} />
            </Link>

            {/* Watch Video Secondary Button */}
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.6875rem 1.625rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                color: '#2563eb',
                border: '1.5px solid #2563eb',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: '1.5px solid #2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={10} fill="#2563eb" color="#2563eb" style={{ marginLeft: '1.5px' }} />
              </div>
              <span>Watch Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Professional Google Drive Campus Video Modal Overlay */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Campus Video Player"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'liaFadeIn 200ms ease-out',
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '960px',
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'liaScaleUp 200ms ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#1e293b',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={12} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    Vignan&apos;s Lara Campus Video Tour
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      margin: 0,
                    }}
                  >
                    Official Campus Overview &bull; Vignan&apos;s Lara Institute of Technology &amp; Science
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Close Video"
                title="Close Video (Esc)"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 16:9 Responsive Video Player Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                backgroundColor: '#000000',
              }}
            >
              <iframe
                src="https://drive.google.com/file/d/1hKivKzSwuLdLjVqdX6Xr8tyO_PFNH21e/preview"
                title="Vignan's Lara Campus Video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes liaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes liaScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (min-width: 1200px) {
          .lia-fullwidth-hero {
            min-height: 500px !important;
          }
          .hero-main-title {
            font-size: 3.25rem !important;
          }
        }
        @media (max-width: 900px) {
          .hero-slogan-container {
            position: static !important;
            margin-bottom: 1rem !important;
          }
          .hero-left-gradient {
            background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.3) 100%) !important;
          }
          .hero-main-title {
            font-size: 2.25rem !important;
          }
          .hero-sub-break {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
