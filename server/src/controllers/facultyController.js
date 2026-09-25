const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Department = require('../models/Department');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * facultyController
 * Handles faculty management, profile retrieval, and administrative actions.
 */

// GET /api/faculty
const getAllFaculty = async (req, res, next) => {
  try {
    const { department, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (department) {
      if (department.match(/^[0-9a-fA-F]{24}$/)) {
        query.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) query.department = deptDoc._id;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [facultyList, total] = await Promise.all([
      Faculty.find(query)
        .populate('user', 'name email phone isActive role')
        .populate('department', 'name code')
        .sort({ employeeId: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Faculty.countDocuments(query),
    ]);

    let filtered = facultyList;
    if (search) {
      const s = search.toLowerCase();
      filtered = facultyList.filter(
        (f) =>
          f.employeeId?.toLowerCase().includes(s) ||
          f.user?.name?.toLowerCase().includes(s) ||
          f.user?.email?.toLowerCase().includes(s) ||
          f.designation?.toLowerCase().includes(s)
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

// GET /api/faculty/me
const getMe = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id })
      .populate('user', 'name email phone profileImage')
      .populate('department', 'name code');

    if (!faculty) {
      return next(new AppError('Faculty profile not found.', 404));
    }

    return sendSuccess(res, faculty);
  } catch (err) {
    next(err);
  }
};

// GET /api/faculty/:id
const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email phone isActive role')
      .populate('department', 'name code');

    if (!faculty) {
      return next(new AppError('Faculty not found.', 404));
    }

    return sendSuccess(res, faculty);
  } catch (err) {
    next(err);
  }
};

// POST /api/faculty - Admin only
const createFaculty = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password = 'Faculty@123',
      employeeId,
      department,
      designation = 'Assistant Professor',
      qualification = '',
      specialization = '',
      phone = '',
    } = req.body;

    if (!name || !email || !employeeId || !department) {
      return next(new AppError('Name, email, employee ID, and department are required.', 400));
    }

    // Resolve Department ID if code passed
    let deptId = department;
    if (!department.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const deptDoc = await Department.findOne({ code: department.toUpperCase() });
      if (!deptDoc) return next(new AppError(`Department ${department} not found.`, 404));
      deptId = deptDoc._id;
    }

    const existingFaculty = await Faculty.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingFaculty) {
      return next(new AppError(`Employee ID ${employeeId} already exists.`, 409));
    }

    const bcrypt = require('bcryptjs');
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const userFaculty = await Faculty.findOne({ user: user._id });
      if (userFaculty) {
        return next(new AppError(`A faculty profile already exists for email ${email}.`, 409));
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'FACULTY',
        phone,
      });
    }

    const faculty = await Faculty.create({
      user: user._id,
      employeeId: employeeId.toUpperCase(),
      department: deptId,
      designation,
      qualification,
      specialization,
      joiningDate: new Date(),
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_FACULTY',
      module: 'FACULTY',
      resourceId: faculty._id,
      description: `Admin created faculty: ${name} (${employeeId.toUpperCase()})`,
      metadata: { facultyId: faculty._id, employeeId: faculty.employeeId, department: deptId },
    });

    const populated = await Faculty.findById(faculty._id)
      .populate('user', 'name email phone isActive')
      .populate('department', 'name code');

    return sendSuccess(res, populated, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Employee ID or Email already exists.', 409));
    }
    next(err);
  }
};

// PUT /api/faculty/:id
const updateFaculty = async (req, res, next) => {
  try {
    const { name, phone, designation, qualification, specialization, department, employeeId, isActive } = req.body;
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return next(new AppError('Faculty not found.', 404));
    }

    // Allow user to edit their own profile or admin
    if (req.user.role === 'FACULTY' && !faculty.user.equals(req.user._id)) {
      return next(new AppError('Unauthorized to update this profile.', 403));
    }

    if (employeeId && req.user.role === 'ADMIN') faculty.employeeId = employeeId.toUpperCase();
    if (designation !== undefined) faculty.designation = designation;
    if (qualification !== undefined) faculty.qualification = qualification;
    if (specialization !== undefined) faculty.specialization = specialization;
    if (department && req.user.role === 'ADMIN') {
      if (department.toString().match(/^[0-9a-fA-F]{24}$/)) {
        faculty.department = department;
      } else {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) faculty.department = deptDoc._id;
      }
    }

    await faculty.save();

    if (name || phone || (isActive !== undefined && req.user.role === 'ADMIN')) {
      await User.findByIdAndUpdate(faculty.user, {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && req.user.role === 'ADMIN' && { isActive }),
      });
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_FACULTY',
      module: 'FACULTY',
      resourceId: faculty._id,
      description: `Admin updated faculty: ${faculty.employeeId}`,
      metadata: { facultyId: faculty._id, employeeId: faculty.employeeId },
    });

    const updated = await Faculty.findById(faculty._id)
      .populate('user', 'name email phone isActive')
      .populate('department', 'name code');

    return sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/faculty/:id - Admin only
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return next(new AppError('Faculty not found.', 404));
    }

    await User.findByIdAndUpdate(faculty.user, { isActive: false });
    await Faculty.findByIdAndDelete(req.params.id);

    await logAudit({
      req,
      action: 'ADMIN_DELETED_FACULTY',
      module: 'FACULTY',
      resourceId: req.params.id,
      description: `Admin deleted faculty: ${faculty.employeeId}`,
      metadata: { employeeId: faculty.employeeId },
    });

    return sendSuccess(res, { message: 'Faculty removed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFaculty,
  getMe,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
