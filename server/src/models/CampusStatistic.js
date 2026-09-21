const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * CampusStatistic
 * Dynamic statistics displayed on the public homepage.
 * Managed by Admin — e.g. "4000+ Students", "300+ Faculty".
 * Content is NOT hardcoded in React; it is fetched from this collection.
 */
const campusStatisticSchema = new Schema(
  {
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
      maxlength: [100, 'Label cannot exceed 100 characters'],
      // e.g. "Students", "Faculty", "Departments", "Events"
    },
    value: {
      type: String,
      required: [true, 'Value is required'],
      trim: true,
      maxlength: [50, 'Value cannot exceed 50 characters'],
      // Stored as string for flexibility: "4000+", "100+", "20"
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [100, 'Icon name cannot exceed 100 characters'],
      // Lucide React icon name or Cloudinary URL for custom icon
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    displayOrder: {
      type: Number,
      min: [0, 'Display order cannot be negative'],
      default: 0,
      // Lower numbers appear first
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
campusStatisticSchema.index({ isPublished: 1, displayOrder: 1 });

module.exports = mongoose.model('CampusStatistic', campusStatisticSchema);
