const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * PlacementApplication
 * A student's application to a specific PlacementDrive.
 * Compound unique index ensures one application record per student per drive.
 */
const placementApplicationSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    placementDrive: {
      type: Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: [true, 'Placement drive is required'],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: [
          'APPLIED',
          'SHORTLISTED',
          'ASSESSMENT',
          'INTERVIEW',
          'SELECTED',
          'REJECTED',
          'WITHDRAWN',
        ],
        message:
          'Status must be APPLIED, SHORTLISTED, ASSESSMENT, INTERVIEW, SELECTED, REJECTED, or WITHDRAWN',
      },
      default: 'APPLIED',
    },
    currentRound: {
      type: String,
      trim: true,
      maxlength: [100, 'Current round cannot exceed 100 characters'],
      // e.g. "Online Test", "HR Round", "Technical Interview"
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// One application per student per placement drive
placementApplicationSchema.index(
  { student: 1, placementDrive: 1 },
  { unique: true }
);
placementApplicationSchema.index({ student: 1, status: 1 });
placementApplicationSchema.index({ placementDrive: 1, status: 1 });

module.exports = mongoose.model('PlacementApplication', placementApplicationSchema);
