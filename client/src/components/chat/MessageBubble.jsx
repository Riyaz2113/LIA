import { CheckCheck } from 'lucide-react';

/**
 * MessageBubble
 * Assistant and User message bubbles matching REFERENCE 1.
 * Features avatar, rounded bubble styling, timestamp, and read receipt.
 */
const MessageBubble = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  if (isAssistant) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
        className="lia-msg-assistant"
      >
        {/* Assistant Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <svg viewBox="0 0 100 100" width="28" height="28">
            <defs>
              <linearGradient id="bubbleHeadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="bubbleScreenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#081b3d" />
                <stop offset="100%" stopColor="#0f2b5c" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="50" r="10" fill="#2563eb" />
            <circle cx="84" cy="50" r="10" fill="#2563eb" />
            <rect x="20" y="24" width="60" height="48" rx="18" fill="url(#bubbleHeadGrad)" />
            <rect x="26" y="30" width="48" height="36" rx="12" fill="url(#bubbleScreenGrad)" />
            <path
              d="M 36 46 C 37 40, 43 40, 44 46"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 56 46 C 57 40, 63 40, 64 46"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 46 54 Q 50 58 54 54"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Bubble & Timestamp */}
        <div style={{ maxWidth: '82%' }}>
          <div
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              borderTopLeftRadius: '4px',
              padding: '0.875rem 1rem',
              color: '#0f172a',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              whiteSpace: 'pre-line',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
            }}
          >
            {message.text}
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              color: '#94a3b8',
              marginTop: '4px',
              marginLeft: '4px',
              fontWeight: 500,
            }}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: '1rem',
      }}
      className="lia-msg-user"
    >
      <div
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          borderRadius: '18px',
          borderBottomRightRadius: '4px',
          padding: '0.75rem 1.125rem',
          fontSize: '0.875rem',
          lineHeight: 1.45,
          maxWidth: '82%',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
        }}
      >
        {message.text}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.6875rem',
          color: '#64748b',
          marginTop: '4px',
          marginRight: '4px',
          fontWeight: 500,
        }}
      >
        <span>{message.timestamp}</span>
        <CheckCheck size={14} color="#2563eb" strokeWidth={2.4} />
      </div>
    </div>
  );
};

export default MessageBubble;
