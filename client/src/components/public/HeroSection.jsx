import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

/**
 * HeroSection
 * Full-width panoramic background hero section matching the exact approved TOP reference.
 * Real campus photograph (ChatGPT Image Sep 19, 2026, 08_57_26 PM.png) extends full-width across the background
 * with a smooth left-side light gradient overlay for maximum text readability and clarity.
 */
const HeroSection = () => {
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

      {/* 2. Hero Content Container (aligned with header/page grid) */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem',
        }}
      >
        {/* Top Right Handwritten Cursive Slogan Floating in Sky */}
        <div
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '8%',
            zIndex: 12,
          }}
          className="hero-slogan-container"
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
              className="cursive-slogan-hero"
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '2.1rem',
                fontWeight: 700,
                color: '#1d4ed8',
                transform: 'rotate(-2.5deg)',
                display: 'inline-block',
                letterSpacing: '0.02em',
                textShadow: '0 1px 3px rgba(255, 255, 255, 0.9)',
                lineHeight: 1.1,
              }}
            >
              People | Knowledge | A Smarter Campus
            </span>
            <svg
              viewBox="0 0 200 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '20px',
                width: '140px',
                height: '8px',
                transform: 'rotate(-2deg)',
                opacity: 0.85,
              }}
            >
              <path
                d="M2 7C45 2 110 3 198 8"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Left Messaging Box */}
        <div
          style={{
            maxWidth: '600px',
            position: 'relative',
            zIndex: 15,
          }}
          className="hero-text-content"
        >
          {/* Welcome Badge */}
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#2563eb',
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
              onClick={() => {
                const aboutElem = document.getElementById('about');
                if (aboutElem) aboutElem.scrollIntoView({ behavior: 'smooth' });
              }}
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

      <style>{`
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
