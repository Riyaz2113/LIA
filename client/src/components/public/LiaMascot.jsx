/**
 * LiaMascot
 * The friendly 3D robot AI character "LIA" featured in the "How It Works" section
 * with a floating speech bubble: "Hi! I'm LIA. How can I help you today?".
 * Styled to match the exact visual finishing of the 1st approved reference.
 */
const LiaMascot = () => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        maxWidth: '340px',
        margin: '0 auto',
      }}
    >
      {/* Speech Bubble (matching 1st reference) */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '0.875rem 1.375rem',
          boxShadow: '0 12px 28px -4px rgba(37, 99, 235, 0.15), 0 2px 6px rgba(15, 23, 42, 0.04)',
          border: '1.5px solid #dbeafe',
          marginBottom: '0.875rem',
          alignSelf: 'flex-start',
          marginLeft: '1.5rem',
        }}
      >
        <div
          style={{
            fontSize: '1.125rem',
            fontWeight: 800,
            color: '#2563eb',
            lineHeight: 1.15,
          }}
        >
          Hi!
        </div>
        <div
          style={{
            fontSize: '1.0625rem',
            fontWeight: 800,
            color: '#2563eb',
            marginBottom: '0.2rem',
            lineHeight: 1.15,
          }}
        >
          I&apos;m LIA
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#0f172a',
              lineHeight: 1.3,
            }}
          >
            How can I help you today?
          </span>
          <span
            style={{
              display: 'inline-flex',
              gap: '2px',
              marginLeft: '2px',
            }}
          >
            <span
              style={{
                width: '3.5px',
                height: '3.5px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: '3.5px',
                height: '3.5px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: '3.5px',
                height: '3.5px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'inline-block',
              }}
            />
          </span>
        </div>

        {/* Speech Bubble Arrow Tail pointing toward the robot */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '32px',
            transform: 'rotate(45deg)',
            width: '14px',
            height: '14px',
            backgroundColor: '#ffffff',
            borderRight: '1.5px solid #dbeafe',
            borderBottom: '1.5px solid #dbeafe',
          }}
        />
      </div>

      {/* 3D Cute Robot Mascot (matching 1st reference) */}
      <div
        style={{
          width: '240px',
          height: '240px',
          position: 'relative',
          filter: 'drop-shadow(0 16px 28px rgba(37, 99, 235, 0.22))',
        }}
      >
        <svg viewBox="0 0 240 240" width="100%" height="100%">
          <defs>
            <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#081b3d" />
              <stop offset="100%" stopColor="#0f2b5c" />
            </linearGradient>
            <linearGradient id="cyanLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="bluePlates" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="120" cy="120" r="100" fill="url(#mascotGlow)" />

          {/* Head Antenna / Earphones */}
          <circle cx="48" cy="95" r="17" fill="url(#bluePlates)" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="48" cy="95" r="8" fill="#38bdf8" />

          <circle cx="192" cy="95" r="17" fill="url(#bluePlates)" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="192" cy="95" r="8" fill="#38bdf8" />

          {/* Antenna Cap */}
          <ellipse cx="120" cy="50" rx="22" ry="7" fill="url(#bluePlates)" />
          <rect x="115" y="40" width="10" height="12" rx="5" fill="#38bdf8" />

          {/* Robot Head Outer Shell */}
          <rect
            x="56"
            y="52"
            width="128"
            height="92"
            rx="36"
            fill="url(#bodyGradient)"
            stroke="#e2e8f0"
            strokeWidth="3.5"
          />

          {/* Robot Face Display Screen */}
          <rect
            x="68"
            y="64"
            width="104"
            height="68"
            rx="24"
            fill="url(#screenGradient)"
          />

          {/* Glowing Happy Curved Cyan Eyes */}
          <path
            d="M 84 92 C 86 82, 98 82, 100 92"
            stroke="#38bdf8"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 140 92 C 142 82, 154 82, 156 92"
            stroke="#38bdf8"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Blush Cheeks */}
          <circle cx="80" cy="106" r="5" fill="#38bdf8" opacity="0.4" />
          <circle cx="160" cy="106" r="5" fill="#38bdf8" opacity="0.4" />

          {/* Cute Curved Smile */}
          <path
            d="M 112 108 Q 120 117 128 108"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Neck Joint */}
          <rect x="105" y="144" width="30" height="12" rx="4" fill="#64748b" />

          {/* Body Torso */}
          <path
            d="M 74 156 C 74 150, 166 150, 166 156 L 180 225 C 180 230, 60 230, 60 225 Z"
            fill="url(#bodyGradient)"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* LIA Chest Badge (Bold royal blue plate with white LIA branding) */}
          <rect x="90" y="168" width="60" height="28" rx="10" fill="url(#bluePlates)" />
          <text
            x="120"
            y="188"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
            fontSize="14"
            letterSpacing="0.08em"
          >
            LIA
          </text>

          {/* Left Arm / Hand */}
          <path
            d="M 64 170 Q 38 185 44 205"
            stroke="url(#bodyGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="44" cy="205" r="10" fill="url(#bluePlates)" />

          {/* Right Arm (Waving up with pointing finger matching reference) */}
          <path
            d="M 176 170 Q 202 155 208 130"
            stroke="url(#bodyGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="208" cy="128" r="11" fill="url(#bluePlates)" />
          {/* Sparkles / Magic Dots */}
          <circle cx="224" cy="115" r="4" fill="#38bdf8" />
          <circle cx="212" cy="102" r="3" fill="#38bdf8" />
        </svg>
      </div>
    </div>
  );
};

export default LiaMascot;
