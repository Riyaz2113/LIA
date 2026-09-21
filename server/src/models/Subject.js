const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Subject
 * An individual taught unit (theory, lab, project) within a department/semester.
 */
const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [200, 'Subject name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Subject code cannot exceed 20 characters'],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1, 'Year must be between 1 and 4'],
      max: [4, 'Year must be between 1 and 4'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [0, 'Credits cannot be negative'],
    },
    type: {
      type: String,
      enum: {
        values: ['THEORY', 'LAB', 'PROJECT', 'OTHER'],
        message: 'Type must be THEORY, LAB, PROJECT, or OTHER',
      },
      required: [true, 'Subject type is required'],
      default: 'THEORY',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
subjectSchema.index({ department: 1, semester: 1 }); // Frequent query: "subjects for dept+sem"
subjectSchema.index({ code: 1 });                    // Unique — explicit

module.exports = mongoose.model('Subject', subjectSchema);
