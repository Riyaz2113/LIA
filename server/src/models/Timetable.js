const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Timetable
 * One slot per ClassSection/Subject/Faculty combination on a given weekday.
 */
const timetableSchema = new Schema(
  {
    classSection: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSection',
      required: [true, 'Class section is required'],
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
    dayOfWeek: {
      type: String,
      enum: {
        values: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
        message: 'Day of week must be a valid weekday',
      },
      required: [true, 'Day of week is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      // Stored as "HH:MM" e.g. "09:00"
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
      maxlength: [50, 'Room cannot exceed 50 characters'],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
timetableSchema.index({ classSection: 1, academicYear: 1, semester: 1 });
timetableSchema.index({ faculty: 1, dayOfWeek: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
