import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ChevronDown,
  BookMarked,
  FileText,
  Eye,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { libraryService } from '../../services/libraryService';

/**
 * StudentLibraryPage
 * Recreated faithfully from approved Reference 8 (media_1789841993528.jpg).
 */
const StudentLibraryPage = () => {
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'journals' | 'digital' | 'issued'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedType, setSelectedType] = useState('All Types');

  const [resourceList, setResourceList] = useState([
    { id: 1, title: 'Data Structures and Algorithms in Java', author: 'Robert Lafore', subject: 'Computer Science', type: 'Book', availability: 'Available' },
    { id: 2, title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', subject: 'Database', type: 'Book', availability: 'Available' },
    { id: 3, title: 'Operating System Concepts', author: 'Abraham Silberschatz', subject: 'Operating Systems', type: 'Book', availability: 'Issued' },
    { id: 4, title: 'Software Engineering', author: 'Ian Sommerville', subject: 'Software Engineering', type: 'Book', availability: 'Available' },
    { id: 5, title: 'Introduction to Machine Learning', author: 'Ethem Alpaydin', subject: 'AI & ML', type: 'Book', availability: 'Available' },
  ]);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await libraryService.getAll();
      if (res && res.data && res.data.length > 0) {
        setResourceList(res.data.map(b => ({
          id: b._id || b.id,
          title: b.title,
          author: b.author || b.authors?.join(', ') || 'Faculty Author',
          subject: b.category || b.department || 'Computer Science',
          type: 'Book',
          availability: (b.availableCopies > 0 || b.available > 0) ? 'Available' : 'Issued'
        })));
      }
    } catch (err) {
      console.warn('Using default library catalog:', err.message);
    }
  };

  const resources = resourceList;

  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === 'All Subjects' || item.subject === selectedSubject;
    const matchesType = selectedType === 'All Types' || item.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Title & Subtitle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.25rem 0',
            }}
          >
            Library Resources
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Access books, journals, e-resources and more.
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '0.25rem',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
          }}
        >
          {[
            { key: 'books', label: 'Books' },
            { key: 'journals', label: 'e-Journals' },
            { key: 'digital', label: 'Digital Resources' },
            { key: 'issued', label: 'My Issued Books' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === t.key ? '#2563eb' : 'transparent',
                color: activeTab === t.key ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Search Field */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search by title, author or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.25rem',
              borderRadius: '8px',
              border: '1.5px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '0.8125rem',
              color: '#0f172a',
              outline: 'none',
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                appearance: 'none',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem 2.25rem 0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Database">Database</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
            </select>
            <ChevronDown
              size={14}
              color="#64748b"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                appearance: 'none',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.5rem 2.25rem 0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="All Types">All Types</option>
              <option value="Book">Physical Book</option>
              <option value="e-Book">e-Book</option>
            </select>
            <ChevronDown
              size={14}
              color="#64748b"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Resources Table Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b' }}>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>#</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Title</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Author</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Subject</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700 }}>Type</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Availability</th>
                <th style={{ padding: '0.875rem 0.75rem', fontWeight: 700, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res) => (
                <tr
                  key={res.id}
                  style={{
                    borderBottom: '1px solid #f8fafc',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '1rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{res.id}</td>
                  <td style={{ padding: '1rem 0.75rem', color: '#0f172a', fontWeight: 700 }}>{res.title}</td>
                  <td style={{ padding: '1rem 0.75rem', color: '#475569' }}>{res.author}</td>
                  <td style={{ padding: '1rem 0.75rem', color: '#334155', fontWeight: 500 }}>{res.subject}</td>
                  <td style={{ padding: '1rem 0.75rem', color: '#64748b' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: res.type === 'e-Book' ? '#fdf4ff' : '#f8fafc',
                        color: res.type === 'e-Book' ? '#9333ea' : '#475569',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                      }}
                    >
                      {res.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        backgroundColor: res.availability === 'Available' ? '#f0fdf4' : '#fef2f2',
                        color: res.availability === 'Available' ? '#16a34a' : '#dc2626',
                        border: `1px solid ${
                          res.availability === 'Available' ? '#bbf7d0' : '#fecaca'
                        }`,
                      }}
                    >
                      {res.availability}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>

                      {res.type === 'e-Book' ? (
                        <button
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Access
                        </button>
                      ) : (
                        <button
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Reserve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bottom Motivational Banner */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #dbeafe',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
            }}
          >
            <BookMarked size={24} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'cursive, "Caveat", "Brush Script MT", sans-serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#1e40af',
                lineHeight: 1.2,
              }}
            >
              A reader today, a leader tomorrow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLibraryPage;
