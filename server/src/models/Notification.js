const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Notification
 * In-app notification sent to a specific User recipient.
 * Socket.IO real-time delivery will be layered on top in a future phase.
 */
const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    recipientType: {
      type: String,
      enum: {
        values: ['STUDENT', 'FACULTY', 'ADMIN'],
        message: 'Recipient type must be STUDENT, FACULTY, or ADMIN',
      },
      required: [true, 'Recipient type is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: [
          'INFO',
          'SUCCESS',
          'WARNING',
          'ALERT',
          'ASSIGNMENT',
          'EXAM',
          'PLACEMENT',
          'EVENT',
          'SYSTEM',
        ],
        message: 'Type must be a valid notification type',
      },
      required: [true, 'Type is required'],
      default: 'INFO',
    },
    link: {
      type: String,
      trim: true,
      maxlength: [500, 'Link cannot exceed 500 characters'],
      // Internal app route to navigate to on click, e.g. "/student/assignments"
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // createdAt serves as the canonical notification timestamp
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 }); // Unread notifications, newest first
notificationSchema.index({ recipient: 1, type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
