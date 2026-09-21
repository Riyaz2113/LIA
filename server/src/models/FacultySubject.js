const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * FacultySubject
 * Maps which Faculty member teaches which Subject to which ClassSection
 * in a given academic year and semester. One record per teaching assignment.
 */
const facultySubjectSchema = new Schema(
  {
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    classSection: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSection',
      required: [true, 'Class section is required'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// A faculty should not be assigned the same subject to the same section twice in same AY
facultySubjectSchema.index(
  { faculty: 1, subject: 1, classSection: 1, academicYear: 1 },
  { unique: true }
);
facultySubjectSchema.index({ faculty: 1, academicYear: 1 });
facultySubjectSchema.index({ classSection: 1, academicYear: 1 });

module.exports = mongoose.model('FacultySubject', facultySubjectSchema);
