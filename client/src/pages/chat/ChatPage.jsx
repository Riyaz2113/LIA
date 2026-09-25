import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Briefcase,
  Calendar,
  ShieldCheck,
  HelpCircle,
  Maximize2,
  MessageSquare,
} from 'lucide-react';
import ChatHome from '../../components/chat/ChatHome';
import ChatConversation from '../../components/chat/ChatConversation';

/**
 * ChatPage
 * Full-screen immersive LIA Chat experience with rich campus visuals, quick prompt launchers,
 * and institutional branding surrounding the approved chat interface.
 * Features functional minimize and restore state.
 */
const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [initialPrompt, setInitialPrompt] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleNavigateToChat = (prompt) => {
    setInitialPrompt(prompt);
    setActiveTab('chat');
    setIsMinimized(false);
  };

  const handleChangeTab = (newTab) => {
    setActiveTab(newTab);
    if (newTab === 'home') {
      setInitialPrompt(null);
    }
  };

  const popularTopics = [
    {
      title: 'Academic Calendar 2025–26',
      desc: 'Semester schedules, exam timetables & key holidays',
      icon: Calendar,
      prompt: 'What is the academic calendar for 2025–26?',
    },
    {
      title: 'Placements & CRT Drives',
      desc: 'Eligibility criteria, top recruiters & training resources',
      icon: Briefcase,
      prompt: 'How to apply for placement drives and preparation resources?',
    },
    {
      title: 'Hostel & Mess Facilities',
      desc: 'Room amenities, dining timings & warden contacts',
      icon: BookOpen,
      prompt: 'What are the hostel facilities and rules?',
    },
    {
      title: 'Technical Clubs & Fests',
      desc: 'Coding club, Robotics, LARA UTSAV 2026 & cultural events',
      icon: Sparkles,
      prompt: 'Tell me about campus clubs, hostel facilities and upcoming events.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#071126',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflow: 'hidden',
      }}
      className="lia-chat-fullscreen-wrapper"
    >
      {/* 1. Immersive Full-Screen Real Campus Background with Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <img
          src="/assets/campus/ChatGPT Image Sep 19, 2026, 08_57_26 PM.png"
          alt="Vignan's Lara Campus Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px) brightness(0.4)',
            transform: 'scale(1.08)',
          }}
        />

        {/* Deep Navy Radial & Linear Gradient Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.35) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(29, 78, 216, 0.3) 0%, transparent 60%), linear-gradient(180deg, rgba(7, 17, 38, 0.88) 0%, rgba(7, 17, 38, 0.96) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* 2. Main Full-Screen Content Grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1440px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="chat-desktop-layout-grid"
      >
        {/* Left Column: Campus AI Brand & Value Highlights */}
        <div
          style={{
            color: '#ffffff',
            display: 'none',
            flexDirection: 'column',
            gap: '1.75rem',
            maxWidth: '380px',
          }}
          className="chat-side-panel-left"
        >
          {/* Back to Home Button */}
          <div>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Heading */}
          <div>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#60a5fa',
                marginBottom: '0.5rem',
              }}
            >
              LARA INTELLIGENT ASSISTANT
            </div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: '#ffffff',
                marginBottom: '0.75rem',
              }}
            >
              Your Smart AI <br />
              <span style={{ color: '#38bdf8' }}>Campus Companion</span>
            </h1>
            <div
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#93c5fd',
                transform: 'rotate(-2deg)',
                display: 'inline-block',
              }}
            >
              &ldquo;People | Knowledge | A Smarter Campus&rdquo;
            </div>
          </div>

          {/* 3 Glassmorphic Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '0.875rem 1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.25)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                  24/7 Verified AI Guidance
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Direct institutional data from Vignan&apos;s Lara
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '0.875rem 1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.25)',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                  Academics, Exams &amp; Placements
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Schedules, hall tickets &amp; recruitment drives
                </div>
              </div>
            </div>
          </div>

          {/* Campus Tagline */}
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
                display: 'inline-block',
              }}
            />
            <span>Connected to Vignan&apos;s Lara Official Knowledge Base</span>
          </div>
        </div>

        {/* Center Column: The Approved Chat Widget or Minimized Floating Launcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          {isMinimized ? (
            /* Minimized Sleek Pill Card */
            <div
              onClick={() => setIsMinimized(false)}
              style={{
                backgroundColor: 'rgba(11, 34, 77, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '2px solid rgba(96, 165, 250, 0.4)',
                borderRadius: '24px',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.125rem',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(37, 99, 235, 0.3)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                maxWidth: '380px',
                width: '100%',
              }}
              className="chat-minimized-launcher"
            >
              {/* LIA Avatar */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  flexShrink: 0,
                }}
              >
                <MessageSquare size={24} color="#ffffff" />
              </div>

              {/* Text Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#ffffff',
                    }}
                  >
                    LIA Chat
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    Online
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#93c5fd',
                    marginTop: '2px',
                  }}
                >
                  Click to expand &amp; continue chatting
                </div>
              </div>

              {/* Maximize Icon Button */}
              <button
                type="button"
                aria-label="Maximize chat"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Maximize2 size={18} />
              </button>
            </div>
          ) : (
            /* Full Chat Interface */
            <div
              style={{
                width: '100%',
                maxWidth: activeTab === 'chat' ? '880px' : '440px',
                height: 'calc(100vh - 4rem)',
                minHeight: '620px',
                borderRadius: '24px',
                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'max-width 200ms ease',
              }}
              className="chat-workspace-card"
            >
              {activeTab === 'home' ? (
                <ChatHome
                  onNavigateToChat={handleNavigateToChat}
                  onChangeTab={handleChangeTab}
                  onMinimize={() => setIsMinimized(true)}
                />
              ) : (
                <ChatConversation
                  onChangeTab={handleChangeTab}
                  initialPrompt={initialPrompt}
                  onMinimize={() => setIsMinimized(true)}
                />
              )}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Quick Topic Prompts */}
        <div
          style={{
            color: '#ffffff',
            display: 'none',
            flexDirection: 'column',
            gap: '1.25rem',
            maxWidth: '380px',
          }}
          className="chat-side-panel-right"
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="#60a5fa" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
              Popular Topics to Ask LIA
            </span>
          </div>

          {/* Clickable Topic Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {popularTopics.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleNavigateToChat(topic.prompt)}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '0.875rem 1.125rem',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                  }}
                  className="chat-side-topic-card"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          marginBottom: '2px',
                        }}
                      >
                        {topic.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          lineHeight: 1.35,
                        }}
                      >
                        {topic.desc}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institutional Badge */}
          <div
            style={{
              backgroundColor: 'rgba(8, 27, 65, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#ffffff' }}>
              Vignan&apos;s Lara Institute of Technology &amp; Science
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#93c5fd', marginTop: '2px' }}>
              Vadlamudi, Guntur &mdash; 522213, Andhra Pradesh
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1080px) {
          .chat-desktop-layout-grid {
            grid-template-columns: minmax(280px, 340px) 1fr !important;
            gap: 2.5rem !important;
          }
          .chat-side-panel-left {
            display: flex !important;
          }
        }
        @media (min-width: 1320px) {
          .chat-desktop-layout-grid {
            grid-template-columns: minmax(280px, 340px) 1fr minmax(280px, 340px) !important;
            gap: 2.5rem !important;
          }
          .chat-side-panel-right {
            display: flex !important;
          }
        }
        .chat-side-topic-card:hover {
          background-color: rgba(30, 58, 138, 0.5) !important;
          border-color: rgba(96, 165, 250, 0.4) !important;
          transform: translateX(4px);
        }
        .chat-minimized-launcher:hover {
          transform: scale(1.03);
          border-color: rgba(147, 197, 253, 0.7) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
