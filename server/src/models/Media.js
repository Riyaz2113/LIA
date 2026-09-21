const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Media
 * Gallery images and media assets for the college website.
 * Managed by Admin and displayed dynamically — no binary data stored here.
 */
const mediaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    url: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
      // Cloudinary URL for the full-size image/video
    },
    thumbnail: {
      type: String,
      // Cloudinary thumbnail URL (smaller version for gallery grid)
      trim: true,
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ['CAMPUS', 'LAB', 'EVENT', 'SPORTS', 'WORKSHOP', 'CULTURAL', 'OTHER'],
        message: 'Category must be CAMPUS, LAB, EVENT, SPORTS, WORKSHOP, CULTURAL, or OTHER',
      },
      required: [true, 'Category is required'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader reference is required'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      min: [0, 'Display order cannot be negative'],
      default: 0,
      // Lower numbers appear first in gallery
    },
  },
  {
    timestamps: true,
    // createdAt is the canonical upload timestamp — keeps parity with spec's uploadedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
mediaSchema.index({ isPublished: 1, displayOrder: 1 });
mediaSchema.index({ category: 1, isPublished: 1 });
mediaSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Media', mediaSchema);
