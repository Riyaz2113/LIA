import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * CtaBanner
 * "Be a Part of a Smarter, Connected Campus"
 * Bottom call-to-action banner with student silhouettes, cursive motto, and Login CTA.
 */
const CtaBanner = () => {
  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: '#071530',
        backgroundImage: 'linear-gradient(135deg, #091a3c 0%, #0d2757 50%, #081632 100%)',
        color: '#ffffff',
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Graphic Silhouette (Students walking / Campus skyline) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '140px',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 1200 140" width="100%" height="100%" preserveAspectRatio="none">
          {/* Subtle student figures with backpacks walking */}
          <g fill="#ffffff">
            {/* Student 1 */}
            <circle cx="80" cy="40" r="14" />
            <path d="M 60 70 L 100 70 L 95 140 L 65 140 Z" />
            {/* Backpack */}
            <rect x="52" y="65" width="14" height="30" rx="4" />

            {/* Student 2 */}
            <circle cx="160" cy="35" r="14" />
            <path d="M 140 65 L 180 65 L 175 140 L 145 140 Z" />
            <rect x="132" y="60" width="14" height="32" rx="4" />

            {/* Student 3 */}
            <circle cx="240" cy="42" r="13" />
            <path d="M 222 72 L 258 72 L 254 140 L 226 140 Z" />

            {/* Student 4 */}
            <circle cx="320" cy="38" r="14" />
            <path d="M 300 68 L 340 68 L 335 140 L 305 140 Z" />
          </g>
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'center',
          }}
          className="cta-grid"
        >
          {/* Left Column: Headline & Action */}
          <div style={{ maxWidth: '620px' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#60a5fa',
                marginBottom: '0.625rem',
              }}
            >
              WHY LIA
            </div>

            <h2
              style={{
                fontSize: '2.125rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}
              className="cta-heading"
            >
              Be a Part of a Smarter, Connected Campus
            </h2>

            <p
              style={{
                fontSize: '0.9375rem',
                color: '#94a3b8',
                marginBottom: '1.75rem',
                lineHeight: 1.5,
              }}
            >
              Join thousands of students, faculty and staff already using LIA.
            </p>

            {/* CTA Button */}
            <div>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  backgroundColor: '#2563eb',
                }}
              >
                <span>Login to LIA</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Column: Cursive Artistic Script "Learn Innovate Grow" */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            className="cta-slogan-wrapper"
          >
            <div
              className="cursive-slogan-cta"
              style={{
                lineHeight: 1.05,
                transform: 'rotate(-4deg)',
              }}
            >
              Learn <br />
              Innovate <br />
              Grow
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .cta-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
          }
          .cta-heading {
            font-size: 2.5rem !important;
          }
        }
        @media (max-width: 899px) {
          .cta-slogan-wrapper {
            justifyContent: flex-start !important;
          }
          .cursive-slogan-cta {
            text-align: left !important;
            font-size: 2.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CtaBanner;
