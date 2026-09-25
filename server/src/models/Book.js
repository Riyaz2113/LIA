const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Book / Library
 * Library catalogue records for students and faculty.
 * Persisted in MongoDB Atlas.
 */
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [200, 'Author cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Computer Science',
    },
    isbn: {
      type: String,
      trim: true,
      default: '978-0000000000',
    },
    total: {
      type: Number,
      required: [true, 'Total copies count is required'],
      min: [1, 'Total copies must be at least 1'],
      default: 10,
    },
    available: {
      type: Number,
      min: [0, 'Available copies cannot be negative'],
      default: 10,
    },
    borrowed: {
      type: Number,
      min: [0, 'Borrowed copies cannot be negative'],
      default: 0,
    },
    shelfLocation: {
      type: String,
      trim: true,
      default: 'Rack A-1',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bookSchema.index({ category: 1 });
bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });

module.exports = mongoose.model('Book', bookSchema);
