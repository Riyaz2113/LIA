const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * StudentRequest
 * A formal request submitted by a student to the administration.
 * Examples: bonafide certificate, ID card reissue, leave approval.
 */
const studentRequestSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['BONAFIDE', 'ID_CARD', 'NO_DUE', 'LEAVE', 'HOSTEL', 'FEE', 'OTHER'],
        message: 'Type must be BONAFIDE, ID_CARD, NO_DUE, LEAVE, HOSTEL, FEE, or OTHER',
      },
      required: [true, 'Request type is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    attachments: [
      {
        type: String,
        // Array of Cloudinary/storage URLs for supporting documents
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'PROCESSING', 'APPROVED', 'REJECTED', 'COMPLETED'],
        message: 'Status must be PENDING, PROCESSING, APPROVED, REJECTED, or COMPLETED',
      },
      default: 'PENDING',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Admin or faculty member handling the request
      default: null,
    },
    response: {
      type: String,
      trim: true,
      maxlength: [2000, 'Response cannot exceed 2000 characters'],
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
studentRequestSchema.index({ student: 1, status: 1 });
studentRequestSchema.index({ student: 1, createdAt: -1 });
studentRequestSchema.index({ status: 1 });
studentRequestSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('StudentRequest', studentRequestSchema);
