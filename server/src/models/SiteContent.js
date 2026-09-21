const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * SiteContent
 * Dynamic CMS content blocks for the public website.
 *
 * The Admin Portal writes to this collection.
 * The public website React frontend reads from it via API.
 * This eliminates the need to hardcode changing website content in React source code.
 *
 * Each document represents one named content block identified by section + key.
 * Example:
 *   section: "HERO"  key: "mainHero"
 *   section: "ABOUT" key: "missionStatement"
 */
const siteContentSchema = new Schema(
  {
    section: {
      type: String,
      enum: {
        values: ['HERO', 'ABOUT', 'FEATURES', 'STATISTICS', 'CAMPUS_LIFE', 'CONTACT', 'FOOTER'],
        message: 'Section must be HERO, ABOUT, FEATURES, STATISTICS, CAMPUS_LIFE, CONTACT, or FOOTER',
      },
      required: [true, 'Section is required'],
    },
    key: {
      type: String,
      required: [true, 'Key is required'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Key cannot exceed 100 characters'],
      // e.g. "mainHero", "missionStatement", "contactAddress"
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: Schema.Types.Mixed,
      // Flexible field for rich/structured content (arrays, nested objects, etc.)
      default: null,
    },
    image: {
      type: String,
      // Cloudinary URL for the section's image
      trim: true,
      default: null,
    },
    buttonText: {
      type: String,
      trim: true,
      maxlength: [100, 'Button text cannot exceed 100 characters'],
      default: null,
    },
    buttonLink: {
      type: String,
      trim: true,
      maxlength: [500, 'Button link cannot exceed 500 characters'],
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Each section/key combination must be unique — prevents duplicate content blocks
siteContentSchema.index(
  { section: 1, key: 1 },
  { unique: true }
);
siteContentSchema.index({ section: 1, isPublished: 1 });

module.exports = mongoose.model('SiteContent', siteContentSchema);
