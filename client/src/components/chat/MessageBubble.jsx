import { CheckCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MessageBubble
 * Assistant and User message bubbles matching LIA design system.
 * Assistant messages safely render Markdown (bold, italic, headings, lists, code, links).
 * User messages remain plain text.
 */
const MessageBubble = ({ message }) => {
  const isAssistant = message.sender === 'assistant' || message.senderType === 'ASSISTANT';
  const contentText = message.text || message.message || '';
  const displayTime = message.timestamp || (message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  if (isAssistant) {
    // Extract unique citation sources from actual metadata
    const rawSources = Array.isArray(message.sources) ? message.sources : [];
    const uniqueSources = [];
    const seenKeys = new Set();

    for (const s of rawSources) {
      if (!s) continue;
      const meta = s.metadata || {};
      const docName = meta.title || meta.source || s.source || s.title || '';
      if (!docName || typeof docName !== 'string') continue;

      const cleanDocName = docName.replace(/\\/g, '/').split('/').pop();
      const page =
        meta.pageNumber !== null && meta.pageNumber !== undefined && meta.pageNumber !== -1
          ? meta.pageNumber
          : s.pageNumber !== null && s.pageNumber !== undefined && s.pageNumber !== -1
          ? s.pageNumber
          : null;

      const key = `${cleanDocName}__page_${page}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueSources.push({
          docName: cleanDocName,
          page,
          section: meta.section || s.section || null,
        });
      }
    }

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

        {/* Bubble, Sources & Timestamp */}
        <div style={{ maxWidth: '88%', width: '100%' }}>
          <div
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              borderTopLeftRadius: '4px',
              padding: '0.875rem 1.125rem',
              color: '#0f172a',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              wordBreak: 'break-word',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
            }}
            className="lia-assistant-bubble"
          >
            <div className="lia-markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p style={{ margin: '0 0 0.5rem 0', lineHeight: 1.55 }}>
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 700, color: '#0f172a' }}>
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em style={{ fontStyle: 'italic' }}>
                      {children}
                    </em>
                  ),
                  h1: ({ children }) => (
                    <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.75rem 0 0.375rem 0', color: '#0f172a' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ fontSize: '1.025rem', fontWeight: 700, margin: '0.625rem 0 0.35rem 0', color: '#0f172a' }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '0.5rem 0 0.25rem 0', color: '#0f172a' }}>
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0.4rem 0 0.2rem 0', color: '#0f172a' }}>
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ margin: '0.25rem 0 0.5rem 0', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ margin: '0.25rem 0 0.5rem 0', paddingLeft: '1.25rem', listStyleType: 'decimal' }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '0.25rem', lineHeight: 1.5 }}>
                      {children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {children}
                    </a>
                  ),
                  code: ({ inline, className, children, ...props }) => {
                    return inline ? (
                      <code
                        style={{
                          backgroundColor: '#e2e8f0',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '4px',
                          fontSize: '0.8125rem',
                          fontFamily: 'monospace',
                          color: '#0f172a',
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.8125rem',
                          color: '#f8fafc',
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre
                      style={{
                        backgroundColor: '#1e293b',
                        color: '#f8fafc',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        fontSize: '0.8125rem',
                        margin: '0.5rem 0',
                      }}
                    >
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      style={{
                        borderLeft: '3px solid #94a3b8',
                        paddingLeft: '0.75rem',
                        margin: '0.5rem 0',
                        color: '#475569',
                        fontStyle: 'italic',
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', margin: '0.5rem 0', width: '100%' }}>
                      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8125rem', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th style={{ border: '1px solid #cbd5e1', padding: '0.4rem 0.6rem', backgroundColor: '#e2e8f0', fontWeight: 700, textAlign: 'left', color: '#0f172a', whiteSpace: 'nowrap' }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{ border: '1px solid #e2e8f0', padding: '0.35rem 0.6rem', color: '#334155' }}>
                      {children}
                    </td>
                  ),
                }}
              >
                {contentText}
              </ReactMarkdown>
            </div>
          </div>

          {/* Citation Source Cards (Rendered when real document metadata exists) */}
          {uniqueSources.length > 0 && (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(241, 245, 249, 0.85)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
              className="lia-sources-card"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#475569',
                }}
              >
                <span>Sources &amp; References</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.375rem',
                }}
              >
                {uniqueSources.map((src, sIdx) => (
                  <div
                    key={sIdx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.75rem',
                      color: '#1e293b',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <span>📄</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{src.docName}</span>
                    {src.page !== null && (
                      <span
                        style={{
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.6875rem',
                          backgroundColor: '#eff6ff',
                          padding: '0.05rem 0.35rem',
                          borderRadius: '4px',
                        }}
                      >
                        Page {src.page}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              fontSize: '0.6875rem',
              color: '#94a3b8',
              marginTop: '4px',
              marginLeft: '4px',
              fontWeight: 500,
            }}
          >
            {displayTime}
          </div>
        </div>
      </div>
    );
  }

  // User Message (Plain text)
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
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
        }}
      >
        {contentText}
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
        <span>{displayTime}</span>
        <CheckCheck size={14} color="#2563eb" strokeWidth={2.4} />
      </div>
    </div>
  );
};

export default MessageBubble;
