const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Mark
 * Individual student result for a specific exam and subject.
 * Compound unique index prevents duplicate mark entries per student/exam/subject.
 */
const markSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Maximum marks are required'],
      min: [0, 'Maximum marks cannot be negative'],
    },
    grade: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [5, 'Grade cannot exceed 5 characters'],
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
      default: '',
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Prevent accidental duplicate mark records for the same student/exam/subject
markSchema.index(
  { student: 1, exam: 1, subject: 1 },
  { unique: true }
);
markSchema.index({ student: 1, academicYear: 1, semester: 1 });
markSchema.index({ exam: 1 });

module.exports = mongoose.model('Mark', markSchema);
