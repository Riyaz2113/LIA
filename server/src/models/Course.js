const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Course
 * Represents a degree programme (e.g. B.Tech AIML, B.Tech CSE).
 * Referenced by ClassSection to group students by programme.
 */
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: [200, 'Course name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Course code cannot exceed 20 characters'],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    duration: {
      type: Number, // Duration in years, e.g. 4
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 year'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
courseSchema.index({ department: 1 });

module.exports = mongoose.model('Course', courseSchema);
