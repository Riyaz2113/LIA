const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * AssignmentSubmission
 * One submission record per student per assignment.
 * Compound unique index enforces this constraint at the DB level.
 */
const assignmentSubmissionSchema = new Schema(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment is required'],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    file: {
      // Cloudinary URL of the submitted file — added in Cloudinary phase
      type: String,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['SUBMITTED', 'LATE', 'GRADED', 'RETURNED'],
        message: 'Status must be SUBMITTED, LATE, GRADED, or RETURNED',
      },
      default: 'SUBMITTED',
    },
    marks: {
      type: Number,
      min: [0, 'Marks cannot be negative'],
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      default: '',
    },
    gradedAt: {
      type: Date,
      default: null,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// One submission per student per assignment
assignmentSubmissionSchema.index(
  { assignment: 1, student: 1 },
  { unique: true }
);
assignmentSubmissionSchema.index({ student: 1, status: 1 });
assignmentSubmissionSchema.index({ assignment: 1, status: 1 });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
