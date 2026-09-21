const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * EventRegistration
 * Tracks a student's registration and attendance for a college Event.
 * Compound unique index ensures one registration record per student per event.
 */
const eventRegistrationSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    attendanceStatus: {
      type: String,
      enum: {
        values: ['REGISTERED', 'CHECKED_IN', 'ABSENT', 'CANCELLED'],
        message: 'Attendance status must be REGISTERED, CHECKED_IN, ABSENT, or CANCELLED',
      },
      default: 'REGISTERED',
    },
    checkInTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// One registration per student per event
eventRegistrationSchema.index(
  { event: 1, student: 1 },
  { unique: true }
);
eventRegistrationSchema.index({ student: 1 });
eventRegistrationSchema.index({ event: 1, attendanceStatus: 1 });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
