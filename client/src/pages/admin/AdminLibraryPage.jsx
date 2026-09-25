import { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import { libraryService } from '../../services/libraryService';

/**
 * AdminLibraryPage
 * Atlas-backed Library administration and books inventory CMS.
 */
const AdminLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirmBook, setDeleteConfirmBook] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await libraryService.getAll({ category: categoryFilter, search: searchQuery });
      if (res && res.data) {
        setBooks(
          res.data.map((b) => ({
            id: b._id || b.id,
            title: b.title,
            author: b.author || 'Unknown Author',
            category: b.category || 'General',
            isbn: b.isbn || 'ISBN-00000',
            total: b.total || 10,
            available: b.available !== undefined ? b.available : 10,
            borrowed: b.borrowed !== undefined ? b.borrowed : 0,
            shelfLocation: b.shelfLocation || 'Rack A-1',
          }))
        );
      }
    } catch (err) {
      showToast('Error loading library catalogue from Atlas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [categoryFilter]);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Computer Science',
    isbn: '',
    total: 20,
    shelfLocation: 'Rack A-1',
  });

  const handleOpenCreate = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      category: 'Computer Science',
      isbn: '',
      total: 20,
      shelfLocation: 'Rack A-1',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      total: book.total,
      shelfLocation: book.shelfLocation || 'Rack A-1',
    });
    setModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    try {
      if (editingBook && editingBook.id) {
        await libraryService.update(editingBook.id, {
          title: formData.title,
          author: formData.author,
          category: formData.category,
          isbn: formData.isbn,
          total: Number(formData.total),
          shelfLocation: formData.shelfLocation,
        });
        showToast(`Book "${formData.title}" updated in Atlas.`);
      } else {
        await libraryService.create({
          title: formData.title,
          author: formData.author,
          category: formData.category,
          isbn: formData.isbn,
          total: Number(formData.total),
          shelfLocation: formData.shelfLocation,
        });
        showToast(`Book "${formData.title}" added to Atlas catalog.`);
      }
      await fetchBooks();
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save book record.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmBook) return;
    try {
      await libraryService.delete(deleteConfirmBook.id);
      showToast(`Book "${deleteConfirmBook.title}" removed from catalog.`);
      await fetchBooks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete book.', 'error');
    } finally {
      setDeleteConfirmBook(null);
    }
  };

  const filteredBooks = books.filter((b) => {
    if (categoryFilter !== 'All' && b.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (
      searchQuery &&
      !b.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.isbn.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
            backgroundColor: toastType === 'error' ? '#ef4444' : '#10b981',
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
          {toastType === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="Library & Catalog CMS"
        description="Manage live institutional books, check availability, and oversee digital catalog entries."
        breadcrumbs={[
          { label: 'Academics', path: '/admin/academics' },
          { label: 'Library' },
        ]}
        actionLabel="Add Book to Catalog"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title, author, or ISBN..."
        filters={[
          {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: ['All', 'Computer Science', 'AI & ML', 'Electronics', 'Mechanical', 'Civil'],
          },
        ]}
      />

      {/* Table */}
      <AdminTable
        columns={[
          { header: 'Book Info' },
          { header: 'Category', width: '160px' },
          { header: 'ISBN', width: '160px' },
          { header: 'Stock (Total / Avail / Borrowed)', width: '220px' },
          { header: 'Location', width: '130px' },
          { header: 'Actions', width: '100px', align: 'right' },
        ]}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          startEntry: filteredBooks.length > 0 ? 1 : 0,
          endEntry: filteredBooks.length,
          totalEntries: filteredBooks.length,
        }}
      >
        {loading ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading library catalogue from MongoDB Atlas...
            </td>
          </tr>
        ) : filteredBooks.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No books found in the library catalog.
            </td>
          </tr>
        ) : (
          filteredBooks.map((book) => (
            <tr key={book.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>by {book.author}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#475569' }}>
                {book.category}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b', fontFamily: 'monospace' }}>
                {book.isbn}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{book.total}</span> total /{' '}
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{book.available} avail</span> /{' '}
                <span style={{ color: '#ea580c', fontWeight: 600 }}>{book.borrowed} out</span>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                {book.shelfLocation}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(book)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #2563eb',
                      color: '#2563eb',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmBook(book)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      {/* Modal for Add / Edit Book */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBook ? 'Edit Book Record' : 'Add New Book to Library'}
      >
        <form onSubmit={handleSaveBook} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
              Book Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Introduction to Algorithms"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                Author(s) *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Cormen, Rivest"
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
                <option value="Computer Science">Computer Science</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>
                ISBN Number
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-0262046305"
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
                Total Copies
              </label>
              <input
                type="number"
                min="1"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
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
                Shelf Location
              </label>
              <input
                type="text"
                value={formData.shelfLocation}
                onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                placeholder="Rack CS-01"
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
              {editingBook ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirmation Modal for Destructive Delete */}
      {deleteConfirmBook && (
        <AdminModal
          isOpen={true}
          onClose={() => setDeleteConfirmBook(null)}
          title="Confirm Book Removal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong style={{ color: '#0f172a' }}>"{deleteConfirmBook.title}"</strong> from the library catalog? This action will permanently remove it from MongoDB Atlas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmBook(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Yes, Delete Book
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminLibraryPage;
