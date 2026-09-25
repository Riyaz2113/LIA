const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Faculty
 * Extended profile for users with role FACULTY.
 * Authentication and credentials live in the User document.
 */
const facultySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true, // One faculty profile per user account
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [30, 'Employee ID cannot exceed 30 characters'],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters'],
      default: '',
    },
    qualification: {
      type: String,
      trim: true,
      maxlength: [200, 'Qualification cannot exceed 200 characters'],
      default: '',
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: [200, 'Specialization cannot exceed 200 characters'],
      default: '',
    },
    joiningDate: {
      type: Date,
      default: null,
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
facultySchema.index({ department: 1 });
facultySchema.index({ isActive: 1 });

module.exports = mongoose.model('Faculty', facultySchema);
