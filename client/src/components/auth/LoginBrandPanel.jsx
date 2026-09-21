import { BookOpen, Users, Lightbulb, TrendingUp } from 'lucide-react';
import LiaLogo from '../public/LiaLogo';

/**
 * LoginBrandPanel
 * The left side campus branding panel matching the exact login reference image.
 * Uses the real campus photograph from /assets/campus/ChatGPT Image Sep 19, 2026, 09_00_49 PM.png.
 */
const LoginBrandPanel = () => {
  const highlights = [
    { label: 'Quality Education', icon: BookOpen },
    { label: 'Vibrant Campus Life', icon: Users },
    { label: 'Innovation & Research', icon: Lightbulb },
    { label: 'Bright Careers', icon: TrendingUp },
  ];

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '680px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#0c224d',
        boxShadow: '0 20px 40px -10px rgba(11, 26, 56, 0.25)',
      }}
    >
      {/* Real Campus Photograph Background Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <img
          src="/assets/campus/ChatGPT Image Sep 19, 2026, 09_00_49 PM.png"
          alt="Vignan's Lara Institute of Technology & Science Campus"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Soft top gradient to ensure brand text readability over sky */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '42%',
            background: 'linear-gradient(180deg, rgba(240, 247, 255, 0.95) 0%, rgba(240, 247, 255, 0.8) 50%, rgba(240, 247, 255, 0) 100%)',
          }}
        />

        {/* Monument Overlay Board in lower left (matching reference) */}
        <div
          style={{
            position: 'absolute',
            bottom: '76px',
            left: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '1.125rem 1.375rem',
            maxWidth: '300px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.08em',
              lineHeight: 1.2,
            }}
          >
            VIGNAN&apos;S LARA
          </div>
          <div
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.08em',
              marginTop: '2px',
              marginBottom: '0.625rem',
              lineHeight: 1.2,
            }}
          >
            INSTITUTE OF TECHNOLOGY &amp; SCIENCE
          </div>
          <div
            className="cursive-slogan-hero"
            style={{
              fontSize: '1.125rem',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            &ldquo;Empowering Minds <br />
            for a Better Tomorrow&rdquo;
          </div>
        </div>
      </div>

      {/* Top Header & Branding Layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '1.75rem 2rem 0.5rem',
        }}
      >
        <LiaLogo />

        {/* Headline & Slogans */}
        <div style={{ marginTop: '2.25rem', maxWidth: '480px' }}>
          <h1
            style={{
              fontSize: '2.375rem',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '0.625rem',
            }}
          >
            A Smarter Campus <br />
            Starts Here
          </h1>

          <p
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.625rem',
            }}
          >
            Access. Learn. Engage. Grow.
          </p>

          {/* Accent Line */}
          <div
            style={{
              width: '40px',
              height: '3.5px',
              backgroundColor: '#0f172a',
              borderRadius: '9999px',
              marginBottom: '0.75rem',
            }}
          />

          {/* Cursive Tagline */}
          <div
            className="cursive-slogan-hero"
            style={{
              fontSize: '1.5rem',
              color: '#1e3a8a',
            }}
          >
            &ldquo;People | Knowledge | A Smarter Campus&rdquo;
          </div>
        </div>
      </div>

      {/* Bottom 4 Feature Highlights in Dark Glassmorphic Bar (matching reference) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(7, 17, 38, 0.94)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '1.125rem 1.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <div style={{ color: '#ffffff' }}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    lineHeight: 1.25,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoginBrandPanel;
