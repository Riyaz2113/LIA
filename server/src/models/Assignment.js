const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Assignment
 * Created by Faculty for a specific Subject and ClassSection.
 */
const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    classSection: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSection',
      required: [true, 'Class section is required'],
    },
    attachment: {
      // Optional file URL (Cloudinary) for the assignment document
      type: String,
      default: null,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Maximum marks are required'],
      min: [0, 'Maximum marks cannot be negative'],
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
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PUBLISHED', 'CLOSED'],
        message: 'Status must be DRAFT, PUBLISHED, or CLOSED',
      },
      default: 'DRAFT',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
assignmentSchema.index({ classSection: 1, subject: 1, academicYear: 1 });
assignmentSchema.index({ faculty: 1, academicYear: 1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
