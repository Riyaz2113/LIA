import { useState } from 'react';
import { Plus, Bot, MessageSquare, Edit3, Trash2, CheckCircle2, Power } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTabs from '../../components/admin/AdminTabs';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import { ADMIN_CHATBOT_DATA } from '../../data/adminMockData';

/**
 * AdminChatbotPage
 * LIA Chatbot content management interface for FAQ knowledge base, suggested prompts, and welcome greetings.
 */
const AdminChatbotPage = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [faqs, setFaqs] = useState(ADMIN_CHATBOT_DATA);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Welcome message state
  const [welcomeGreeting, setWelcomeGreeting] = useState(
    "Hello! I am LIA, your intelligent academic assistant for Vignan's Lara. How can I help you today?"
  );

  const [formData, setFormData] = useState({
    category: 'Academic Calendar',
    question: '',
    answer: '',
    status: 'Active',
  });

  const tabs = [
    { id: 'faq', name: 'FAQ & Knowledge Base' },
    { id: 'welcome', name: 'Welcome Message & Prompts' },
  ];

  const filteredFaqs = faqs.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (
      searchQuery &&
      !item.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    const newFaq = {
      id: Date.now(),
      ...formData,
    };

    setFaqs([newFaq, ...faqs]);
    setModalOpen(false);
    setFormData({
      category: 'Academic Calendar',
      question: '',
      answer: '',
      status: 'Active',
    });

    setToastMessage('Chatbot response added successfully!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    setToastMessage('Chatbot response removed.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleStatus = (id) => {
    setFaqs(
      faqs.map((f) =>
        f.id === id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f
      )
    );
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '13.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="LIA Chatbot CMS"
        description="Manage the institutional knowledge base, canned responses, and greeting cards for the LIA AI Assistant."
        breadcrumbs={[
          { label: 'Website & Content', path: '/admin/gallery' },
          { label: 'Chatbot Content' },
        ]}
        actionLabel={activeTab === 'faq' ? 'Add Q&A Entry' : 'Save Greeting'}
        actionIcon={activeTab === 'faq' ? Plus : Bot}
        onAction={() => {
          if (activeTab === 'faq') setModalOpen(true);
          else {
            setToastMessage('Chatbot greeting updated successfully!');
            setTimeout(() => setToastMessage(''), 3500);
          }
        }}
      />

      {/* Tabs */}
      <AdminTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'faq' ? (
        <>
          {/* Filters */}
          <AdminFilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search question or response..."
            filters={[
              {
                name: 'category',
                value: categoryFilter,
                onChange: setCategoryFilter,
                options: [
                  { value: 'All', label: 'All Categories' },
                  { value: 'Academic Calendar', label: 'Academic Calendar' },
                  { value: 'Admissions', label: 'Admissions' },
                  { value: 'Placements', label: 'Placements' },
                  { value: 'Facilities', label: 'Facilities' },
                ],
              },
            ]}
          />

          {/* FAQs Table */}
          <AdminTable
            columns={[
              { key: 'category', label: 'Category', width: '160px' },
              { key: 'question', label: 'Student / User Question' },
              { key: 'answer', label: 'Assistant Response' },
              { key: 'status', label: 'Status', width: '110px' },
              { key: 'actions', label: 'Actions', width: '120px' },
            ]}
            data={filteredFaqs}
            totalItems={filteredFaqs.length}
            itemsPerPage={10}
            currentPage={1}
            onPageChange={() => {}}
            renderRow={(faq) => (
              <tr
                key={faq.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Category */}
                <td style={{ padding: '14px 16px', color: '#334155', fontSize: '13px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: '#1e40af',
                    }}
                  >
                    {faq.category}
                  </span>
                </td>

                {/* Question */}
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={14} color="#2563eb" />
                    {faq.question}
                  </div>
                </td>

                {/* Answer */}
                <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px', lineHeight: 1.5 }}>
                  {faq.answer}
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <AdminStatusBadge status={faq.status} />
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      title="Toggle Active/Inactive"
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: faq.status === 'Active' ? '#16a34a' : '#94a3b8',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleStatus(faq.id)}
                    >
                      <Power size={14} />
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDeleteFaq(faq.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </>
      ) : (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px',
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0' }}>
            LIA Assistant Greeting & Suggested Queries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '700px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Default Welcome Message
              </label>
              <textarea
                rows={3}
                value={welcomeGreeting}
                onChange={(e) => setWelcomeGreeting(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Suggested Quick Prompts for Students
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['When is the mid-term assessment?', 'Show today’s timetable for III Year CSE', 'What placement drives are scheduled this month?'].map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      color: '#1e293b',
                    }}
                  >
                    "{p}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Chatbot FAQ Response"
      >
        <form onSubmit={handleAddFaq} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              <option value="Academic Calendar">Academic Calendar</option>
              <option value="Admissions">Admissions</option>
              <option value="Placements">Placements</option>
              <option value="Facilities">Facilities</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Student / User Question *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. How do I request an official transcript?"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Assistant Response / Answer *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter the official response to provide when queried..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '8px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Save Response
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminChatbotPage;
