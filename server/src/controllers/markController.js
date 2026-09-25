const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');

/**
 * markController
 * Handles student results, grades, and faculty marks entry.
 */

// Helper to compute letter grade from marks/maxMarks
const calculateGrade = (marks, maxMarks) => {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return 'O';
  if (pct >= 80) return 'A+';
  if (pct >= 70) return 'A';
  if (pct >= 60) return 'B+';
  if (pct >= 50) return 'B';
  if (pct >= 40) return 'C';
  return 'F';
};

// GET /api/marks/student - Student results
const getStudentMarks = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return next(new AppError('Student profile not found.', 404));
    }

    const marksList = await Mark.find({ student: student._id })
      .populate('subject', 'name code credits')
      .populate('exam', 'name type maxMarks date')
      .sort({ createdAt: -1 });

    return sendSuccess(res, marksList);
  } catch (err) {
    next(err);
  }
};

// GET /api/marks - Admin/Faculty results list
const getAllMarks = async (req, res, next) => {
  try {
    const { exam, subject, academicYear, semester } = req.query;
    const query = {};

    if (exam) query.exam = exam;
    if (subject) query.subject = subject;
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = Number(semester);

    const marksList = await Mark.find(query)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('subject', 'name code credits')
      .populate('exam', 'name type maxMarks date')
      .sort({ createdAt: -1 });

    return sendSuccess(res, marksList);
  } catch (err) {
    next(err);
  }
};

// POST /api/marks - Faculty/Admin marks entry
const enterMarks = async (req, res, next) => {
  try {
    const { student, subject, exam, marks, maxMarks = 100, academicYear = '2026-27', semester = 1, remarks } = req.body;
    if (!student || !subject || !exam || marks === undefined) {
      return next(new AppError('Student, subject, exam, and marks are required.', 400));
    }

    const grade = calculateGrade(Number(marks), Number(maxMarks));

    const markRecord = await Mark.findOneAndUpdate(
      { student, subject, exam },
      {
        marks: Number(marks),
        maxMarks: Number(maxMarks),
        grade,
        academicYear,
        semester: Number(semester),
        remarks: remarks || '',
      },
      { new: true, upsert: true, runValidators: true }
    )
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('subject', 'name code')
      .populate('exam', 'name type');

    return sendSuccess(res, markRecord, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStudentMarks,
  getAllMarks,
  enterMarks,
};
