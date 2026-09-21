const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Company
 * A recruiting company that participates in placement drives.
 * Referenced by PlacementDrive to avoid repeating company data.
 */
const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    logo: {
      type: String,
      // Cloudinary URL for company logo
      default: null,
    },
    website: {
      type: String,
      trim: true,
      maxlength: [300, 'Website URL cannot exceed 300 characters'],
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, 'Industry cannot exceed 100 characters'],
      default: '',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
      default: '',
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
companySchema.index({ name: 1 });
companySchema.index({ isActive: 1 });

module.exports = mongoose.model('Company', companySchema);
