import { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ActionButtons from './ActionButtons';
import SuggestedQuestions from './SuggestedQuestions';
import ChatComposer from './ChatComposer';
import ChatBottomNav from './ChatBottomNav';

/**
 * ChatConversation
 * Exact recreation of REFERENCE 1 (LIA Conversation Screen).
 * Shows date header, full dialogue flow matching reference, action buttons, 2x2 suggested questions,
 * message composer with typing simulation, and bottom navigation.
 */
const ChatConversation = ({ onChangeTab, initialPrompt, onMinimize, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hello! 👋\nI’m LIA, your virtual assistant.\nI can help you with academic information, exams, placements, campus life and more.\n\nWhat would you like to know today?",
      timestamp: '10:24 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'What is the academic calendar?',
      timestamp: '10:25 AM',
    },
    {
      id: 'm3',
      sender: 'assistant',
      text: 'The academic calendar for the academic year 2025–26 is available on the official website.\n\nYou can view important dates for:\n• Semester start and end dates\n• Examination schedules\n• Holidays and events\n\nWould you like me to open the academic calendar for you?',
      timestamp: '10:25 AM',
      hasActions: true,
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle prompt if passed from ChatHome
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = (textToSend) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate Assistant Response
    setTimeout(() => {
      let botReply = `Thank you for your query about "${textToSend}". Here is the verified information from Vignan's Lara Institute of Technology & Science:\n\n• Verified institutional record updated for AY 2025–26.\n• You can access full details on the student portal or contact your departmental coordinator.\n\nIs there anything else I can assist you with?`;

      if (textToSend.toLowerCase().includes('hostel')) {
        botReply = `Vignan's Lara provides separate, secure, and fully equipped hostels for both boys and girls with:\n\n• 24/7 high-speed Wi-Fi & power backup\n• Nutritious hygienic dining facility\n• Resident wardens and medical assistance\n• Indoor sports and study rooms`;
      } else if (textToSend.toLowerCase().includes('placement')) {
        botReply = `The Training & Placement Cell at Vignan's Lara actively prepares students for top tier IT and core engineering companies:\n\n• 100+ recruitment drives annually (TCS, Infosys, Wipro, Cognizant, etc.)\n• Comprehensive CRT (Campus Recruitment Training)\n• Mock interviews, coding bootcamps & soft skills development`;
      } else if (textToSend.toLowerCase().includes('exam')) {
        botReply = `Examination notifications & schedules:\n\n• Mid-term & Semester End Examinations are conducted per JNTUK/University guidelines.\n• Hall tickets and time tables are published under the student examination portal 2 weeks prior.`;
      } else if (textToSend.toLowerCase().includes('club') || textToSend.toLowerCase().includes('event')) {
        botReply = `Campus Life & Student Clubs:\n\n• Technical Clubs: Coding Club, Robotics Club, AI & IoT Innovators\n• Cultural & Arts: LARA UTSAV, Music, Dance & Dramatics Society\n• Sports & NSS: Annual sports meets, athletics, and social outreach initiatives`;
      }

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleActionClick = (actionLabel) => {
    handleSendMessage(`I clicked: ${actionLabel}`);
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
        height: '740px',
      }}
      className="lia-chat-conversation-container"
    >
      {/* 1. Gradient Header */}
      <ChatHeader onMinimize={onMinimize} onClose={onClose} />

      {/* 2. Messages Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 1.25rem 0.5rem',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Date Center Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#64748b',
              backgroundColor: '#f8fafc',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
            }}
          >
            Today, Sep 15, 2026
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble message={msg} />
            {msg.hasActions && <ActionButtons onActionClick={handleActionClick} />}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
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
              }}
            >
              <span style={{ fontSize: '0.75rem' }}>🤖</span>
            </div>
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '0.625rem 1rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
              <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animationDelay: '200ms' }} />
              <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animationDelay: '400ms' }} />
            </div>
          </div>
        )}

        {/* Suggested Questions Grid (Reference 1) */}
        <SuggestedQuestions onSelectQuestion={handleSendMessage} />

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Composer & Bottom Nav */}
      <div style={{ padding: '0 1rem 0.25rem', backgroundColor: '#ffffff' }}>
        <ChatComposer
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          isTyping={isTyping}
        />
      </div>

      <ChatBottomNav activeTab="chat" onChangeTab={onChangeTab} />

      <style>{`
        @keyframes bounceDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .typing-dot {
          animation: bounceDot 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ChatConversation;
