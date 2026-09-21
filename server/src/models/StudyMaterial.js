const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * StudyMaterial
 * Files/resources uploaded by faculty for a specific subject and class section.
 * File binary data is NOT stored here — only metadata and the remote URL.
 */
const studyMaterialSchema = new Schema(
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
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    classSection: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSection',
      required: [true, 'Class section is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
      // Cloudinary or other storage URL — never store binary in DB
    },
    fileType: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'File type cannot exceed 20 characters'],
      // e.g. "PDF", "DOCX", "PPTX", "MP4"
      default: null,
    },
    fileSize: {
      type: Number,
      // Size in bytes
      min: [0, 'File size cannot be negative'],
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ['NOTES', 'LECTURE', 'LAB', 'QUESTION_PAPER', 'REFERENCE', 'OTHER'],
        message: 'Category must be NOTES, LECTURE, LAB, QUESTION_PAPER, REFERENCE, or OTHER',
      },
      required: [true, 'Category is required'],
      default: 'NOTES',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
studyMaterialSchema.index({ subject: 1, classSection: 1 });
studyMaterialSchema.index({ faculty: 1 });
studyMaterialSchema.index({ category: 1 });
studyMaterialSchema.index({ isPublished: 1 });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
