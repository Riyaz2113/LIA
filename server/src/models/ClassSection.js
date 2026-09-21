const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * ClassSection
 * Represents a specific class group, e.g.:
 *   AIML | B.Tech | 4th Year | Sem 7 | Section A | AY 2026-27
 *
 * Students array is stored here for class-level membership.
 * This is manageable because the list is bounded (~60 students per section).
 */
const classSectionSchema = new Schema(
  {
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1, 'Year must be between 1 and 4'],
      max: [4, 'Year must be between 1 and 4'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true,
      maxlength: [5, 'Section cannot exceed 5 characters'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
      // e.g. "2026-27"
    },
    classAdvisor: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Prevent duplicate sections for same dept/year/sem/section/AY combination
classSectionSchema.index(
  { department: 1, year: 1, semester: 1, section: 1, academicYear: 1 },
  { unique: true }
);
classSectionSchema.index({ academicYear: 1 });
classSectionSchema.index({ classAdvisor: 1 });

module.exports = mongoose.model('ClassSection', classSectionSchema);
