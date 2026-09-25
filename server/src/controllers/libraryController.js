const Book = require('../models/Book');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

// Initial default seed if collection is empty
const defaultBooks = [
  { title: 'Introduction to Algorithms (4th Ed)', author: 'Cormen, Leiserson, Rivest', category: 'Computer Science', isbn: '978-0262046305', total: 45, available: 32, borrowed: 13, shelfLocation: 'Rack CS-01' },
  { title: 'Database System Concepts (7th Ed)', author: 'Silberschatz, Korth', category: 'Computer Science', isbn: '978-0078022159', total: 30, available: 21, borrowed: 9, shelfLocation: 'Rack CS-02' },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', category: 'AI & ML', isbn: '978-0134610993', total: 25, available: 18, borrowed: 7, shelfLocation: 'Rack AI-01' },
  { title: 'Digital Logic and Computer Design', author: 'M. Morris Mano', category: 'Electronics', isbn: '978-9332542525', total: 40, available: 35, borrowed: 5, shelfLocation: 'Rack EC-01' },
  { title: 'Engineering Thermodynamics', author: 'P.K. Nag', category: 'Mechanical', isbn: '978-9352606405', total: 20, available: 16, borrowed: 4, shelfLocation: 'Rack ME-01' },
];

/**
 * libraryController
 * Handles library book catalog, digital journals, and borrowed volumes persisted in MongoDB Atlas.
 */

// GET /api/library
const getAllBooks = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    let count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany(defaultBooks);
    }

    let books = await Book.find(query).sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s) ||
          b.isbn?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, books);
  } catch (err) {
    next(err);
  }
};

// GET /api/library/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return next(new AppError('Book not found.', 404));
    }
    return sendSuccess(res, book);
  } catch (err) {
    next(err);
  }
};

// POST /api/library - Admin only
const createBook = async (req, res, next) => {
  try {
    const { title, author, category = 'Computer Science', isbn = '978-0000000000', total = 10, shelfLocation = 'Rack A-1' } = req.body;
    if (!title || !author) {
      return next(new AppError('Title and author are required.', 400));
    }

    const totalNum = Math.max(1, Number(total) || 1);
    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      total: totalNum,
      available: totalNum,
      borrowed: 0,
      shelfLocation,
      isActive: true,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_BOOK',
      module: 'LIBRARY',
      resourceId: book._id,
      description: `Admin created library book: "${book.title}" by ${book.author}`,
      metadata: { bookId: book._id, title: book.title, category: book.category },
    });

    return sendSuccess(res, book, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/library/:id - Admin only
const updateBook = async (req, res, next) => {
  try {
    const { title, author, category, isbn, total, available, borrowed, shelfLocation, isActive } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new AppError('Book not found.', 404));
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (isbn !== undefined) book.isbn = isbn;
    if (shelfLocation !== undefined) book.shelfLocation = shelfLocation;
    if (total !== undefined) {
      book.total = Number(total);
      if (available === undefined && borrowed === undefined) {
        book.available = Math.max(0, book.total - (book.borrowed || 0));
      }
    }
    if (available !== undefined) book.available = Number(available);
    if (borrowed !== undefined) book.borrowed = Number(borrowed);
    if (isActive !== undefined) book.isActive = isActive;

    await book.save();

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_BOOK',
      module: 'LIBRARY',
      resourceId: book._id,
      description: `Admin updated library book: "${book.title}"`,
      metadata: { bookId: book._id, title: book.title },
    });

    return sendSuccess(res, book);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/library/:id - Admin only
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return next(new AppError('Book not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_BOOK',
      module: 'LIBRARY',
      resourceId: book._id,
      description: `Admin deleted library book: "${book.title}"`,
      metadata: { bookId: book._id, title: book.title },
    });

    return sendSuccess(res, { message: 'Book deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
