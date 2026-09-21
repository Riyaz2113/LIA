const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Notice
 * Institution-wide announcement visible on the public website and portals.
 * Content is managed by Admin and must be dynamic (not hardcoded in frontend).
 */
const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['ACADEMIC', 'EXAM', 'PLACEMENT', 'EVENT', 'GENERAL', 'URGENT'],
        message: 'Category must be ACADEMIC, EXAM, PLACEMENT, EVENT, GENERAL, or URGENT',
      },
      required: [true, 'Category is required'],
      default: 'GENERAL',
    },
    image: {
      type: String,
      // Optional Cloudinary URL for a notice banner image
      default: null,
    },
    attachments: [
      {
        type: String,
        // Array of Cloudinary/storage URLs for attached files
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
      // null means no expiry
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'NORMAL', 'HIGH'],
        message: 'Priority must be LOW, NORMAL, or HIGH',
      },
      default: 'NORMAL',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
noticeSchema.index({ isPublished: 1, publishDate: -1 }); // Fetch published notices, newest first
noticeSchema.index({ category: 1 });
noticeSchema.index({ priority: 1 });
noticeSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Notice', noticeSchema);
