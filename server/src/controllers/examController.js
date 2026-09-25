const Exam = require('../models/Exam');
const Subject = require('../models/Subject');
const ClassSection = require('../models/ClassSection');
const Department = require('../models/Department');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');

/**
 * examController
 * Exam schedules, halls, and seating configuration.
 */

// GET /api/exams
const getAllExams = async (req, res, next) => {
  try {
    const { status, subject, department, semester } = req.query;
    const query = {};

    if (status) query.status = status.toUpperCase();
    if (semester) query.semester = Number(semester);

    let exams = await Exam.find(query)
      .populate('subject', 'name code credits department')
      .populate({
        path: 'classSection',
        populate: { path: 'department', select: 'name code' },
      })
      .sort({ date: 1 });

    if (department) {
      const d = department.toUpperCase();
      exams = exams.filter((e) => e.classSection?.department?.code === d || e.subject?.department?.code === d);
    }

    return sendSuccess(res, exams);
  } catch (err) {
    next(err);
  }
};

// GET /api/exams/:id
const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('subject', 'name code credits')
      .populate('classSection');

    if (!exam) {
      return next(new AppError('Exam not found.', 404));
    }
    return sendSuccess(res, exam);
  } catch (err) {
    next(err);
  }
};

// POST /api/exams - Admin only
const createExam = async (req, res, next) => {
  try {
    const {
      name,
      type = 'MID',
      subject,
      department,
      date,
      startTime = '10:00',
      endTime = '12:00',
      room = 'Hall A',
      maxMarks = 100,
      academicYear = '2026-27',
      semester = 1,
      instructions = '',
      status = 'SCHEDULED',
    } = req.body;

    if (!name || !subject || !date) {
      return next(new AppError('Exam name, subject, and date are required.', 400));
    }

    let subjectId = subject;
    if (!subject.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const subjDoc = await Subject.findOne({ code: subject.toUpperCase() });
      if (subjDoc) subjectId = subjDoc._id;
      else {
        const anySubj = await Subject.findOne();
        subjectId = anySubj ? anySubj._id : null;
      }
    }

    const defaultClassSection = await ClassSection.findOne();
    const classSectionId = defaultClassSection ? defaultClassSection._id : null;

    const exam = await Exam.create({
      name,
      type: type.toUpperCase(),
      subject: subjectId,
      classSection: classSectionId,
      date: new Date(date),
      startTime,
      endTime,
      room,
      maxMarks: Number(maxMarks),
      academicYear,
      semester: Number(semester),
      instructions,
      status: status.toUpperCase(),
    });

    const populated = await Exam.findById(exam._id)
      .populate('subject', 'name code')
      .populate('classSection');

    return sendSuccess(res, populated, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/exams/:id - Admin only
const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('subject', 'name code')
      .populate('classSection');

    if (!exam) {
      return next(new AppError('Exam not found.', 404));
    }
    return sendSuccess(res, exam);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/exams/:id - Admin only
const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return next(new AppError('Exam not found.', 404));
    }
    return sendSuccess(res, { message: 'Exam removed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
