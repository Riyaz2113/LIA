const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Attendance
 * Single attendance record per student per subject per session per date.
 * Compound index prevents accidental duplicates.
 */
const attendanceSchema = new Schema(
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
    classSection: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSection',
      required: [true, 'Class section is required'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
        message: 'Status must be PRESENT, ABSENT, LATE, or EXCUSED',
      },
      required: [true, 'Attendance status is required'],
    },
    session: {
      type: String,
      enum: {
        values: ['MORNING', 'AFTERNOON', 'OTHER'],
        message: 'Session must be MORNING, AFTERNOON, or OTHER',
      },
      required: [true, 'Session is required'],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [300, 'Remarks cannot exceed 300 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Prevent duplicate attendance entry for the same student/subject/date/session
attendanceSchema.index(
  { student: 1, subject: 1, date: 1, session: 1 },
  { unique: true }
);
attendanceSchema.index({ classSection: 1, date: 1 });   // Fetch class attendance by date
attendanceSchema.index({ student: 1, subject: 1 });     // Student attendance per subject
attendanceSchema.index({ faculty: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
