import { useState } from 'react';
import { Search, Send } from 'lucide-react';
import ChatHeader from './ChatHeader';
import OnlineStatus from './OnlineStatus';
import QuickHelp from './QuickHelp';
import ChatBottomNav from './ChatBottomNav';

/**
 * ChatHome
 * Exact recreation of REFERENCE 2 (LIA Chat Home / Quick Help Screen).
 * Gradient welcome area, online status badge, quick help category cards, bottom search, and bottom nav.
 */
const ChatHome = ({ onNavigateToChat, onChangeTab, onMinimize, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateToChat(searchQuery.trim());
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 50px -10px rgba(11, 26, 56, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
      className="lia-chat-home-container"
    >
      {/* 1. Gradient Header & Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #092c74 0%, #0d419d 55%, #0a3382 100%)',
          color: '#ffffff',
        }}
      >
        <ChatHeader onMinimize={onMinimize} onClose={onClose} />

        {/* Welcome Text Content */}
        <div style={{ padding: '0.75rem 1.375rem 2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              margin: '0 0 0.35rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            Hello!
          </h1>
          <h2
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              margin: '0 0 0.625rem 0',
            }}
          >
            How can I help you today?
          </h2>
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#dbeafe',
              lineHeight: 1.45,
              margin: 0,
              maxWidth: '360px',
            }}
          >
            Get instant answers about academics, exams, placements, campus life and more.
          </p>
        </div>
      </div>

      {/* 2. Main Content Body (White card area) */}
      <div
        style={{
          padding: '1.25rem 1.25rem 0.75rem',
          flex: 1,
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          maxHeight: '440px',
        }}
      >
        {/* LIA is Online Status Card */}
        <OnlineStatus />

        {/* Quick Help 4 Categories */}
        <QuickHelp onSelectTopic={(topic) => onNavigateToChat(topic)} />

        {/* Search For Help Input Box */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '0.5rem 0.875rem',
            gap: '0.625rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            transition: 'border-color 150ms ease',
          }}
        >
          <Search size={18} color="#64748b" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '0.875rem',
              color: '#0f172a',
            }}
          />
          <button
            type="submit"
            aria-label="Send query"
            style={{
              background: 'none',
              border: 'none',
              color: searchQuery.trim() ? '#2563eb' : '#94a3b8',
              cursor: searchQuery.trim() ? 'pointer' : 'default',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* 3. Bottom Navigation */}
      <ChatBottomNav activeTab="home" onChangeTab={onChangeTab} />
    </div>
  );
};

export default ChatHome;
