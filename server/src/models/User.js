const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * User
 * Central authentication entity for all roles: STUDENT, FACULTY, ADMIN.
 * Student and Faculty profiles are stored in separate collections and
 * reference this document. Never expose password in API responses.
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['STUDENT', 'FACULTY', 'ADMIN'],
        message: 'Role must be STUDENT, FACULTY, or ADMIN',
      },
      required: [true, 'Role is required'],
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'Please provide a valid phone number'],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Ensure password is never returned even when explicitly selecting all fields
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 });      // Already unique, but explicit for clarity
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
