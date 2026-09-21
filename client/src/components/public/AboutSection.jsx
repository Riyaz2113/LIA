import { ArrowRight, Lightbulb, ShieldCheck, Globe, Cpu } from 'lucide-react';

/**
 * AboutSection
 * "ABOUT LIA — More Than a Portal, A Smarter Campus Experience"
 * Finishes the About section with the seamless panoramic campus bleed and glassmorphic quote card
 * matching the approved 1st reference specification.
 */
const AboutSection = () => {
  const pillars = [
    { label: 'Smart', icon: Lightbulb },
    { label: 'Reliable', icon: ShieldCheck },
    { label: 'Accessible', icon: Globe },
    { label: 'Future Ready', icon: Cpu },
  ];

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        paddingTop: '4.5rem',
        paddingBottom: '4.75rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        overflow: 'hidden',
        minHeight: '480px',
      }}
      className="lia-about-section"
    >
      {/* 1. Right-Side Seamless Panoramic Campus Photo with Feathery Soft Bleed */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '58%',
          zIndex: 1,
          overflow: 'hidden',
        }}
        className="about-bg-media-container"
      >
        <img
          src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_59_11 PM.png"
          alt="Vignan's Lara Institute of Technology & Science Campus Building & Amphitheater"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />

        {/* Soft feather gradient mask on left edge to blend seamlessly into white content area */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background:
              'linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.95) 12%, rgba(255, 255, 255, 0.65) 28%, rgba(255, 255, 255, 0.15) 50%, transparent 75%)',
            pointerEvents: 'none',
          }}
          className="about-left-fade"
        />

        {/* Top/Bottom subtle edge blend */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(180deg, #ffffff 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(0deg, #ffffff 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* 2. Glassmorphic Glowing Quote Pill (matching 1st reference bottom right) */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '6%',
            backgroundColor: 'rgba(8, 43, 99, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '2px solid rgba(147, 197, 253, 0.4)',
            borderRadius: '16px',
            padding: '0.875rem 1.75rem',
            boxShadow: '0 12px 30px rgba(8, 43, 99, 0.35)',
            zIndex: 10,
          }}
          className="about-floating-quote-pill"
        >
          <span
            style={{
              fontFamily: "'Caveat', cursive, sans-serif",
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            &ldquo;Empowering Minds for a Better Tomorrow&rdquo;
          </span>
        </div>
      </div>

      {/* 3. Left Content (aligned inside container) */}
      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '560px' }} className="about-text-column">
          {/* Section Tag */}
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#2563eb',
              marginBottom: '0.75rem',
            }}
          >
            ABOUT LIA
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.18,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '1.25rem',
            }}
            className="about-main-heading"
          >
            More Than a Portal <br />
            <span style={{ color: '#2563eb' }}>A Smarter Campus Experience</span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '0.9375rem',
              color: '#475569',
              lineHeight: 1.7,
              marginBottom: '1.75rem',
              maxWidth: '520px',
            }}
          >
            LIA (Lara Intelligent Assistant) is an integrated platform designed for the students,
            faculty and administration of Vignan&apos;s Lara Institute of Technology &amp; Science. It
            brings together academic resources, real-time notifications, campus services and
            AI-powered assistance &mdash; all in one place.
          </p>

          {/* Learn More Button */}
          <div style={{ marginBottom: '2.25rem' }}>
            <a
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6875rem 1.625rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                transition: 'all 150ms ease',
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
              <span>Learn More</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </a>
          </div>

          {/* 4 Value Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1.5px solid #f1f5f9',
            }}
            className="about-pillars-row"
          >
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} strokeWidth={2.4} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    {pillar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .about-bg-media-container {
            position: relative !important;
            width: 100% !important;
            height: 320px !important;
            margin-top: 2rem !important;
            border-radius: 16px !important;
          }
          .about-left-fade {
            display: none !important;
          }
          .about-floating-quote-pill {
            right: 16px !important;
            bottom: 16px !important;
          }
          .about-main-heading {
            font-size: 2.125rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
