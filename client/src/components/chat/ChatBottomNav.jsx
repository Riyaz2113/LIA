import { Home, MessageSquare, HelpCircle } from 'lucide-react';

/**
 * ChatBottomNav
 * 3-tab bottom navigation matching both Reference 1 & Reference 2.
 * Tabs: Home, Messages / Chat, Help.
 */
const ChatBottomNav = ({ activeTab = 'home', onChangeTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: activeTab === 'home' ? 'Messages' : 'Chat', icon: MessageSquare },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0.625rem 0.5rem 0.75rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f1f5f9',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
      }}
      className="lia-chat-bottom-nav"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab && onChangeTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '0.375rem 1.25rem',
              backgroundColor: isActive && tab.id === 'chat' ? '#eff6ff' : 'transparent',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#2563eb' : '#64748b',
              position: 'relative',
              transition: 'all 150ms ease',
            }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 2}
              fill={isActive && (tab.id === 'home' || tab.id === 'chat') ? '#2563eb' : 'none'}
              color={isActive ? '#2563eb' : '#64748b'}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2563eb' : '#64748b',
              }}
            >
              {tab.label}
            </span>

            {/* Active Indicator Underline for Home on Home Screen */}
            {isActive && tab.id === 'home' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  width: '28px',
                  height: '3px',
                  backgroundColor: '#2563eb',
                  borderRadius: '9999px',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChatBottomNav;
