const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * PlacementDrive
 * A specific job opening / campus recruitment drive by a Company.
 * Contains eligibility criteria and drive scheduling details.
 */
const placementDriveSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Job title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    eligibility: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    package: {
      type: String,
      trim: true,
      maxlength: [100, 'Package cannot exceed 100 characters'],
      // e.g. "6 LPA", "5-8 LPA" — stored as string for flexibility
      default: null,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
      default: '',
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    driveDate: {
      type: Date,
      default: null,
    },
    registrationLink: {
      type: String,
      trim: true,
      default: null,
    },
    eligibleDepartments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Department',
      },
    ],
    minimumCgpa: {
      type: Number,
      min: [0, 'Minimum CGPA cannot be negative'],
      max: [10, 'Minimum CGPA cannot exceed 10'],
      default: null,
    },
    maxBacklogs: {
      type: Number,
      min: [0, 'Max backlogs cannot be negative'],
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['UPCOMING', 'OPEN', 'CLOSED', 'COMPLETED'],
        message: 'Status must be UPCOMING, OPEN, CLOSED, or COMPLETED',
      },
      default: 'UPCOMING',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
placementDriveSchema.index({ status: 1, driveDate: 1 });
placementDriveSchema.index({ company: 1 });
placementDriveSchema.index({ applicationDeadline: 1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
