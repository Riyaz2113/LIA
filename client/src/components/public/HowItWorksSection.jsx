import { useNavigate } from 'react-router-dom';
import { User, LayoutGrid, Bell } from 'lucide-react';
import LiaMascot from './LiaMascot';

/**
 * HowItWorksSection
 * "HOW IT WORKS — Get Started with LIA in Simple Steps"
 * 4 connected steps with dashed path, double ring on Step 1, and the LIA AI mascot on the right.
 */
const HowItWorksSection = () => {
  const navigate = useNavigate();
  const steps = [
    {
      stepNumber: 1,
      title: 'Choose Your Role',
      description: 'Student, Faculty, Admin or Guest',
      icon: User,
      activeRing: true,
    },
    {
      stepNumber: 2,
      title: 'Login Securely',
      description: 'Use your credentials to access the portal',
      icon: User,
    },
    {
      stepNumber: 3,
      title: 'Explore Features',
      description: 'Navigate through modules and services',
      icon: LayoutGrid,
    },
    {
      stepNumber: 4,
      title: 'Stay Updated',
      description: 'Get real-time notifications and alerts',
      icon: Bell,
    },
  ];

  return (
    <section
      style={{
        paddingTop: '4.5rem',
        paddingBottom: '3.5rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        overflow: 'hidden',
      }}
      className="lia-how-it-works-section"
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#2563eb',
              marginBottom: '0.625rem',
            }}
          >
            HOW IT WORKS
          </div>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
            }}
            className="how-it-works-heading"
          >
            Get Started <span style={{ color: '#2563eb' }}>with LIA in Simple Steps</span>
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#64748b',
              maxWidth: '600px',
              marginInline: 'auto',
              lineHeight: 1.5,
            }}
          >
            Access the information you need in just a few clicks.
          </p>
        </div>

        {/* Content Layout: 4 Steps on Left/Center + Mascot on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'flex-end',
          }}
          className="how-it-works-split"
        >
          {/* Steps Flow (4 Connected Steps with Dashed Line) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              position: 'relative',
              paddingBottom: '1.5rem',
            }}
            className="steps-horizontal-grid"
          >
            {/* Dashed connector line behind step circles extending toward mascot */}
            <div
              style={{
                position: 'absolute',
                top: '32px',
                left: '10%',
                right: '-8%',
                height: '2px',
                borderTop: '2px dashed #93c5fd',
                zIndex: 1,
              }}
              className="steps-connector-line"
            />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.stepNumber}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {/* Step Icon Circle (Step 1 has concentric double ring matching reference) */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      boxShadow: step.activeRing
                        ? '0 0 0 4px #ffffff, 0 0 0 6px #2563eb, 0 8px 18px rgba(37, 99, 235, 0.35)'
                        : '0 0 0 4px #ffffff, 0 6px 16px rgba(37, 99, 235, 0.25)',
                      transition: 'transform 160ms ease',
                    }}
                  >
                    <Icon size={24} strokeWidth={2.4} />
                  </div>

                  {/* Step Number */}
                  <div
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {step.stepNumber}
                  </div>

                  {/* Step Title */}
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '0.375rem',
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: '#64748b',
                      lineHeight: 1.4,
                      maxWidth: '140px',
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: LIA Robot Mascot (clickable to open chat) */}
          <div
            onClick={() => navigate('/chat')}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              cursor: 'pointer',
              transition: 'transform 180ms ease',
            }}
            className="mascot-chat-trigger"
            title="Chat with LIA"
          >
            <LiaMascot />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .how-it-works-split {
            grid-template-columns: 1.55fr 0.85fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 900px) {
          .steps-horizontal-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2.5rem 1rem !important;
          }
          .steps-connector-line {
            display: none !important;
          }
          .how-it-works-heading {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
