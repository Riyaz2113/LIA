const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Exam
 * Scheduled examination — internal, mid, end-semester, lab, or other.
 */
const examSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
      maxlength: [200, 'Exam name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['INTERNAL', 'MID', 'END_SEMESTER', 'LAB', 'OTHER'],
        message: 'Type must be INTERNAL, MID, END_SEMESTER, LAB, or OTHER',
      },
      required: [true, 'Exam type is required'],
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    classSection: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSection',
      required: [true, 'Class section is required'],
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'],
    },
    room: {
      type: String,
      trim: true,
      maxlength: [100, 'Room cannot exceed 100 characters'],
      default: '',
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
    instructions: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
        message: 'Status must be SCHEDULED, COMPLETED, or CANCELLED',
      },
      default: 'SCHEDULED',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
examSchema.index({ classSection: 1, date: 1 });
examSchema.index({ subject: 1, academicYear: 1 });
examSchema.index({ status: 1 });

module.exports = mongoose.model('Exam', examSchema);
