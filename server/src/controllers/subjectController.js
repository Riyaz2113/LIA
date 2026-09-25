const Subject = require('../models/Subject');
const Department = require('../models/Department');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * subjectController
 * Course curriculum, credits, and subject allocation management.
 */

// GET /api/subjects
const getAllSubjects = async (req, res, next) => {
  try {
    const { department, semester, year, search, includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    if (department) {
      if (department.match(/^[0-9a-fA-F]{24}$/)) {
        query.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) query.department = deptDoc._id;
      }
    }

    if (semester) query.semester = Number(semester);
    if (year) query.year = Number(year);

    let subjects = await Subject.find(query)
      .populate('department', 'name code')
      .sort({ code: 1 });

    if (search) {
      const s = search.toLowerCase();
      subjects = subjects.filter(
        (subj) =>
          subj.name.toLowerCase().includes(s) ||
          subj.code.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, subjects);
  } catch (err) {
    next(err);
  }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('department', 'name code');
    if (!subject) {
      return next(new AppError('Subject not found.', 404));
    }
    return sendSuccess(res, subject);
  } catch (err) {
    next(err);
  }
};

// POST /api/subjects - Admin only
const createSubject = async (req, res, next) => {
  try {
    const { name, code, department, semester, year = 1, credits, type = 'THEORY', description } = req.body;
    if (!name || !code || !department || !semester || credits === undefined) {
      return next(new AppError('Name, code, department, semester, and credits are required.', 400));
    }

    let deptId = department;
    if (!department.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const deptDoc = await Department.findOne({ code: department.toUpperCase() });
      if (!deptDoc) return next(new AppError(`Department ${department} not found.`, 404));
      deptId = deptDoc._id;
    }

    const subject = await Subject.create({
      name,
      code: code.toUpperCase(),
      department: deptId,
      semester: Number(semester),
      year: Number(year),
      credits: Number(credits),
      type,
      description,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_SUBJECT',
      module: 'SUBJECTS',
      resourceId: subject._id,
      description: `Admin created subject: ${name} (${code.toUpperCase()})`,
      metadata: { subjectId: subject._id, code: subject.code, department: deptId },
    });

    const populated = await Subject.findById(subject._id).populate('department', 'name code');
    return sendSuccess(res, populated, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError(`Subject code ${req.body.code} already exists.`, 409));
    }
    next(err);
  }
};

// PUT /api/subjects/:id - Admin only
const updateSubject = async (req, res, next) => {
  try {
    const { name, code, credits, semester, year, type, description, department, isActive } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return next(new AppError('Subject not found.', 404));
    }

    if (name) subject.name = name;
    if (code) subject.code = code.toUpperCase();
    if (credits !== undefined) subject.credits = Number(credits);
    if (semester !== undefined) subject.semester = Number(semester);
    if (year !== undefined) subject.year = Number(year);
    if (type) subject.type = type;
    if (description !== undefined) subject.description = description;
    if (isActive !== undefined) subject.isActive = isActive;

    if (department) {
      if (department.toString().match(/^[0-9a-fA-F]{24}$/)) {
        subject.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) subject.department = deptDoc._id;
      }
    }

    await subject.save();

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_SUBJECT',
      module: 'SUBJECTS',
      resourceId: subject._id,
      description: `Admin updated subject: ${subject.code}`,
      metadata: { subjectId: subject._id, code: subject.code },
    });

    const updated = await Subject.findById(subject._id).populate('department', 'name code');
    return sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/subjects/:id - Admin only
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!subject) {
      return next(new AppError('Subject not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DEACTIVATED_SUBJECT',
      module: 'SUBJECTS',
      resourceId: subject._id,
      description: `Admin deactivated subject: ${subject.code}`,
      metadata: { code: subject.code },
    });

    return sendSuccess(res, { message: 'Subject deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
