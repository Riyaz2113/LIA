const Student = require('../models/Student');
const User = require('../models/User');
const Department = require('../models/Department');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * studentController
 * Handles student data access, profile retrieval, and administrative CRUD operations.
 */

// GET /api/students - Admin/Faculty
const getAllStudents = async (req, res, next) => {
  try {
    const { search, department, year, section, page = 1, limit = 50 } = req.query;
    const query = {};

    if (department) {
      if (department.match(/^[0-9a-fA-F]{24}$/)) {
        query.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) query.department = deptDoc._id;
      }
    }

    if (year) query.year = Number(year);
    if (section) query.section = section.toUpperCase();

    const skip = (Number(page) - 1) * Number(limit);

    let studentQuery = Student.find(query)
      .populate('user', 'name email phone isActive role')
      .populate('department', 'name code')
      .sort({ rollNumber: 1 })
      .skip(skip)
      .limit(Number(limit));

    const [students, total] = await Promise.all([
      studentQuery,
      Student.countDocuments(query),
    ]);

    // Apply text search on populated name if search query exists
    let filtered = students;
    if (search) {
      const s = search.toLowerCase();
      filtered = students.filter(
        (st) =>
          st.rollNumber?.toLowerCase().includes(s) ||
          st.user?.name?.toLowerCase().includes(s) ||
          st.user?.email?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, filtered, 200, {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/me - Student's own profile
const getMe = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email phone profileImage')
      .populate('department', 'name code');

    if (!student) {
      return next(new AppError('Student profile not found for this account.', 404));
    }

    return sendSuccess(res, student);
  } catch (err) {
    next(err);
  }
};

// GET /api/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email phone isActive role')
      .populate('department', 'name code');

    if (!student) {
      return next(new AppError('Student not found.', 404));
    }

    // Role check: Students can only view their own profile
    if (req.user.role === 'STUDENT' && !student.user._id.equals(req.user._id)) {
      return next(new AppError('Unauthorized to view this student profile.', 403));
    }

    return sendSuccess(res, student);
  } catch (err) {
    next(err);
  }
};

// POST /api/students - Admin only
const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password = 'Student@123',
      rollNumber,
      department,
      year = 1,
      semester = 1,
      section = 'A',
      admissionYear = new Date().getFullYear(),
      phone = '',
    } = req.body;

    if (!name || !email || !rollNumber || !department) {
      return next(new AppError('Name, email, roll number, and department are required.', 400));
    }

    // Resolve Department ID if code passed
    let deptId = department;
    if (!department.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const deptDoc = await Department.findOne({ code: department.toUpperCase() });
      if (!deptDoc) return next(new AppError(`Department ${department} not found.`, 404));
      deptId = deptDoc._id;
    }

    const bcrypt = require('bcryptjs');

    // Check duplicate rollNumber
    const existingStudent = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingStudent) {
      return next(new AppError(`Roll number ${rollNumber} already exists.`, 409));
    }

    // Create or find User
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const userStudent = await Student.findOne({ user: user._id });
      if (userStudent) {
        return next(new AppError(`A student profile already exists for email ${email}.`, 409));
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'STUDENT',
        phone,
      });
    }

    // Create Student document
    const studentData = {
      user: user._id,
      rollNumber: rollNumber.toUpperCase(),
      department: deptId,
      year: Number(year),
      semester: Number(semester),
      section: section.toUpperCase(),
      admissionYear: Number(admissionYear),
      batch: `${admissionYear}-${Number(admissionYear) + 4}`,
    };
    if (req.body.registrationNumber) {
      studentData.registrationNumber = req.body.registrationNumber.toUpperCase();
    }

    const student = await Student.create(studentData);

    await logAudit({
      req,
      action: 'ADMIN_CREATED_STUDENT',
      module: 'STUDENTS',
      resourceId: student._id,
      description: `Admin created student: ${name} (${rollNumber.toUpperCase()})`,
      metadata: { studentId: student._id, rollNumber: student.rollNumber, department: deptId },
    });

    const populated = await Student.findById(student._id)
      .populate('user', 'name email phone isActive')
      .populate('department', 'name code');

    return sendSuccess(res, populated, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Roll number, registration number, or email already exists.', 409));
    }
    next(err);
  }
};

// PUT /api/students/:id - Admin only
const updateStudent = async (req, res, next) => {
  try {
    const { name, phone, year, semester, section, department, rollNumber, isActive } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return next(new AppError('Student not found.', 404));
    }

    if (rollNumber) student.rollNumber = rollNumber.toUpperCase();
    if (year !== undefined) student.year = Number(year);
    if (semester !== undefined) student.semester = Number(semester);
    if (section !== undefined) student.section = section.toUpperCase();
    if (department) {
      if (department.toString().match(/^[0-9a-fA-F]{24}$/)) {
        student.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) student.department = deptDoc._id;
      }
    }

    await student.save();

    // Update user info if name / phone / isActive passed
    if (name || phone || isActive !== undefined) {
      await User.findByIdAndUpdate(student.user, {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
      });
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_STUDENT',
      module: 'STUDENTS',
      resourceId: student._id,
      description: `Admin updated student: ${student.rollNumber}`,
      metadata: { studentId: student._id, rollNumber: student.rollNumber },
    });

    const updated = await Student.findById(student._id)
      .populate('user', 'name email phone isActive')
      .populate('department', 'name code');

    return sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id - Admin only
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new AppError('Student not found.', 404));
    }

    // Safely deactivate User account and remove student record
    await User.findByIdAndUpdate(student.user, { isActive: false });
    await Student.findByIdAndDelete(req.params.id);

    await logAudit({
      req,
      action: 'ADMIN_DELETED_STUDENT',
      module: 'STUDENTS',
      resourceId: req.params.id,
      description: `Admin deleted student: ${student.rollNumber}`,
      metadata: { rollNumber: student.rollNumber },
    });

    return sendSuccess(res, { message: 'Student deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllStudents,
  getMe,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
