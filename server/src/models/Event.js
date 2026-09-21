const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Event
 * College events — workshops, hackathons, cultural, sports, etc.
 * Managed by Admin and displayed dynamically on the public website and portals.
 */
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      // Cloudinary URL for event poster/banner
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ['WORKSHOP', 'HACKATHON', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'ALUMNI', 'OTHER'],
        message: 'Category must be WORKSHOP, HACKATHON, CULTURAL, SPORTS, TECHNICAL, ALUMNI, or OTHER',
      },
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
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
    venue: {
      type: String,
      trim: true,
      maxlength: [200, 'Venue cannot exceed 200 characters'],
      default: '',
    },
    organizer: {
      type: String,
      trim: true,
      maxlength: [200, 'Organizer cannot exceed 200 characters'],
      default: '',
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    maxParticipants: {
      type: Number,
      min: [0, 'Max participants cannot be negative'],
      default: null,
      // null means unlimited
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
        message: 'Status must be UPCOMING, ONGOING, COMPLETED, or CANCELLED',
      },
      default: 'UPCOMING',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
eventSchema.index({ isPublished: 1, date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ date: -1 });

module.exports = mongoose.model('Event', eventSchema);
