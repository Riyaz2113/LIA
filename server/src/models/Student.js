const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Student
 * Extended academic profile for users with role STUDENT.
 * Authentication and credentials live in the User document.
 */
const studentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true, // One student profile per user account
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [30, 'Roll number cannot exceed 30 characters'],
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      maxlength: [30, 'Registration number cannot exceed 30 characters'],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1, 'Year must be between 1 and 4'],
      max: [4, 'Year must be between 1 and 4'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true,
      maxlength: [5, 'Section cannot exceed 5 characters'],
    },
    admissionYear: {
      type: Number,
      required: [true, 'Admission year is required'],
    },
    batch: {
      type: String,
      trim: true,
      maxlength: [20, 'Batch cannot exceed 20 characters'],
      // e.g. "2023-27"
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: {
        values: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
        message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY',
      },
      default: null,
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' },
    },
    personalEmail: {
      type: String,
      trim: true,
      default: '',
    },
    alternatePhone: {
      type: String,
      trim: true,
      default: '',
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: '',
    },
    guardianName: {
      type: String,
      trim: true,
      maxlength: [100, "Guardian name cannot exceed 100 characters"],
      default: '',
    },
    guardianPhone: {
      type: String,
      trim: true,
      default: '',
    },
    achievements: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,   // Cloudinary URL — stored later
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
studentSchema.index({ department: 1 });
studentSchema.index({ department: 1, year: 1, semester: 1, section: 1 });
studentSchema.index({ admissionYear: 1 });
studentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Student', studentSchema);
