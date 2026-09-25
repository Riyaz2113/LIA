import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ActionButtons from './ActionButtons';
import SuggestedQuestions from './SuggestedQuestions';
import ChatComposer from './ChatComposer';
import ChatBottomNav from './ChatBottomNav';
import chatService from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

/**
 * ChatConversation
 * Production LIA Conversation Screen powered by persistent MongoDB Atlas multi-turn chat.
 * Shows date header, message stream, action buttons, 2x2 suggested questions,
 * message composer with live assistant stream, and bottom navigation.
 */
const ChatConversation = ({ onChangeTab, initialPrompt, onMinimize, onClose }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      _id: 'welcome-1',
      senderType: 'ASSISTANT',
      message: "Hello! 👋\nI’m LIA, your virtual assistant for Vignan's Lara Institute of Technology & Science.\nI can assist you with academic information, exams, placements, timetable schedules, and campus life.\n\nWhat would you like to know today?",
      createdAt: new Date(),
      hasActions: true,
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const messagesEndRef = useRef(null);
  const isInitializingRef = useRef(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize or fetch latest conversation once authentication state is resolved
  useEffect(() => {
    if (isLoading) return; // Wait until AuthContext finishes /api/auth/me
    if (!isAuthenticated) return;

    const initConversation = async () => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      try {
        const res = await chatService.getConversations();
        const convos = res.data || [];
        if (convos.length > 0) {
          const latestConvo = convos[0];
          setConversationId(latestConvo._id);
          const detailRes = await chatService.getConversationById(latestConvo._id);
          if (detailRes.data?.messages && detailRes.data.messages.length > 0) {
            setMessages(detailRes.data.messages);
          }
        }
      } catch (err) {
        console.warn('Chat conversation init status:', err.response?.data?.message || err.message);
      }
    };

    initConversation();
  }, [isLoading, isAuthenticated]);

  // Handle prompt if passed from ChatHome
  useEffect(() => {
    if (!isLoading && initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [isLoading, initialPrompt]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || !textToSend.trim()) return;

    if (!isAuthenticated) {
      const unauthBubble = {
        _id: `unauth_${Date.now()}`,
        senderType: 'ASSISTANT',
        message: '⚠️ Please log in to your account to send questions to LIA.',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, unauthBubble]);
      return;
    }

    setErrorNotice(null);
    const tempUserMsg = {
      _id: `temp_user_${Date.now()}`,
      senderType: 'USER',
      message: textToSend.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let activeId = conversationId;

      // If no active conversation exists in state, create a new conversation thread
      if (!activeId) {
        const createRes = await chatService.createConversation({
          title: textToSend.trim().slice(0, 50),
          initialMessage: textToSend.trim(),
        });
        if (createRes.data?.conversation) {
          activeId = createRes.data.conversation._id;
          setConversationId(activeId);
          if (createRes.data.messages && createRes.data.messages.length > 0) {
            setMessages(createRes.data.messages);
            setIsTyping(false);
            return;
          }
        }
      }

      // Send message to active conversation
      const sendRes = await chatService.sendMessage(activeId, textToSend.trim());
      if (sendRes.data?.assistantMessage) {
        setMessages((prev) => {
          // Replace temporary user message with server-persisted user message if available
          const filtered = prev.filter((m) => m._id !== tempUserMsg._id);
          const finalUserMsg = sendRes.data.userMessage || tempUserMsg;
          return [...filtered, finalUserMsg, sendRes.data.assistantMessage];
        });
      }
    } catch (err) {
      console.error('LIA Assistant error:', err);
      const errMsg = err.response?.data?.message || 'The assistant is temporarily unavailable. Please try again.';
      setErrorNotice(errMsg);

      // Add a clean error bubble to the thread
      const errBubble = {
        _id: `err_${Date.now()}`,
        senderType: 'ASSISTANT',
        message: `⚠️ ${errMsg}`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errBubble]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (actionLabel) => {
    handleSendMessage(`Tell me more about ${actionLabel}`);
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
        height: '100%',
        minHeight: '620px',
        maxHeight: 'calc(100vh - 4.5rem)',
        margin: '0 auto',
        overflow: 'hidden',
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
        {messages.map((msg, idx) => (
          <div key={msg._id || msg.id || `msg_${idx}`}>
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
