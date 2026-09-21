const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Department
 * Academic department entity. HOD references a User with FACULTY role.
 */
const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      maxlength: [150, 'Department name cannot exceed 150 characters'],
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Department code cannot exceed 20 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    hod: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      default: null,
    },
    phone: {
      type: String,
      trim: true,
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
departmentSchema.index({ code: 1 });   // Unique — explicit
departmentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Department', departmentSchema);
