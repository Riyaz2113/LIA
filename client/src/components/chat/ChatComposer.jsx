import { Paperclip, Send } from 'lucide-react';

/**
 * ChatComposer
 * Message input bar matching REFERENCE 1.
 * Features paperclip attachment icon, styled input, and circular royal blue send button.
 */
const ChatComposer = ({ input, setInput, onSend, isTyping }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSend(input.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: '9999px',
        padding: '0.375rem 0.5rem 0.375rem 0.875rem',
        gap: '0.625rem',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      className="lia-chat-composer"
    >
      {/* Attachment / Paperclip Icon */}
      <button
        type="button"
        aria-label="Attach file"
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paperclip size={18} strokeWidth={2.2} />
      </button>

      {/* Input Field */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        disabled={isTyping}
        style={{
          flex: 1,
          border: 'none',
          backgroundColor: 'transparent',
          outline: 'none',
          fontSize: '0.875rem',
          color: '#0f172a',
          padding: '0.375rem 0',
        }}
      />

      {/* Blue Circular Send Button */}
      <button
        type="submit"
        disabled={!input.trim() || isTyping}
        aria-label="Send message"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: input.trim() && !isTyping ? '#2563eb' : '#93c5fd',
          color: '#ffffff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: input.trim() && !isTyping ? 'pointer' : 'default',
          flexShrink: 0,
          transition: 'all 150ms ease',
          boxShadow: input.trim() ? '0 2px 6px rgba(37, 99, 235, 0.35)' : 'none',
        }}
      >
        <Send size={15} style={{ transform: 'translateX(-1px)' }} />
      </button>
    </form>
  );
};

export default ChatComposer;
