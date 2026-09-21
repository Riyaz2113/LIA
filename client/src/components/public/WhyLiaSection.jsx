import { Layers, Clock, MessageCircle, Cpu, Users } from 'lucide-react';

/**
 * WhyLiaSection
 * "Built for a Smarter Tomorrow"
 * Dark navy banner section with 5 key value highlights.
 */
const WhyLiaSection = () => {
  const highlights = [
    {
      id: 'centralized',
      title: 'Centralized Information',
      description: 'All campus resources in one place',
      icon: Layers,
    },
    {
      id: 'saves-time',
      title: 'Saves Time',
      description: 'Quick and easy access',
      icon: Clock,
    },
    {
      id: 'improves-comm',
      title: 'Improves Communication',
      description: 'Real-time updates',
      icon: MessageCircle,
    },
    {
      id: 'ai-support',
      title: 'AI-Powered Support',
      description: 'Get instant answers',
      icon: Cpu,
    },
    {
      id: 'campus-life',
      title: 'Enhanced Campus Life',
      description: 'Stay connected and engaged',
      icon: Users,
    },
  ];

  return (
    <section
      id="academics"
      style={{
        position: 'relative',
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        backgroundColor: '#091a3c',
        backgroundImage: 'radial-gradient(circle at 50% 30%, #0e2a5f 0%, #071530 100%)',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Decorative subtle background overlay lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              marginBottom: '0.625rem',
            }}
          >
            WHY LIA
          </div>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            Built for a Smarter Tomorrow
          </h2>
        </div>

        {/* 5 Value Props Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '2rem 1.5rem',
          }}
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Icon Outline Box */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(56, 189, 248, 0.4)',
                    backgroundColor: 'rgba(14, 42, 95, 0.6)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    transition: 'all 200ms ease',
                  }}
                  className="why-icon-box"
                >
                  <Icon size={24} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.375rem',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#94a3b8',
                    lineHeight: 1.45,
                    maxWidth: '180px',
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .why-icon-box:hover {
          border-color: #38bdf8 !important;
          background-color: rgba(56, 189, 248, 0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};

export default WhyLiaSection;
