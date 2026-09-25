const Department = require('../models/Department');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * departmentController
 * Department entity CRUD and capacity stats.
 */

// GET /api/departments - Public / Authenticated
const getAllDepartments = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    const departments = await Department.find(query)
      .populate('hod', 'name email phone employeeId')
      .sort({ code: 1 });

    // Aggregate dynamic faculty and student counts per department
    const deptIds = departments.map((d) => d._id);
    const [facultyCounts, studentCounts] = await Promise.all([
      Faculty.aggregate([
        { $match: { department: { $in: deptIds } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
      Student.aggregate([
        { $match: { department: { $in: deptIds } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
    ]);

    const fMap = new Map(facultyCounts.map((f) => [f._id.toString(), f.count]));
    const sMap = new Map(studentCounts.map((s) => [s._id.toString(), s.count]));

    const enriched = departments.map((d) => ({
      ...d.toObject(),
      facultyCount: fMap.get(d._id.toString()) || 0,
      studentCount: sMap.get(d._id.toString()) || 0,
    }));

    return sendSuccess(res, enriched);
  } catch (err) {
    next(err);
  }
};

// GET /api/departments/:id
const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id).populate('hod', 'name email phone employeeId');
    if (!dept) {
      return next(new AppError('Department not found.', 404));
    }
    return sendSuccess(res, dept);
  } catch (err) {
    next(err);
  }
};

// POST /api/departments - Admin only
const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, hod, email, phone } = req.body;
    if (!name || !code) {
      return next(new AppError('Department name and code are required.', 400));
    }

    const dept = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
      hod: hod || null,
      email,
      phone,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_DEPARTMENT',
      module: 'DEPARTMENTS',
      resourceId: dept._id,
      description: `Admin created department: ${name} (${code.toUpperCase()})`,
      metadata: { departmentId: dept._id, code: dept.code },
    });

    return sendSuccess(res, dept, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError(`Department code ${req.body.code} already exists.`, 409));
    }
    next(err);
  }
};

// PUT /api/departments/:id - Admin only
const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, hod, email, phone, isActive, code } = req.body;
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(code && { code: code.toUpperCase() }),
        ...(description !== undefined && { description }),
        ...(hod !== undefined && { hod: hod || null }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    ).populate('hod', 'name email phone employeeId');

    if (!dept) {
      return next(new AppError('Department not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_DEPARTMENT',
      module: 'DEPARTMENTS',
      resourceId: dept._id,
      description: `Admin updated department: ${dept.code}`,
      metadata: { departmentId: dept._id, code: dept.code },
    });

    return sendSuccess(res, dept);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/departments/:id - Admin only (Safe archive/deactivate)
const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!dept) {
      return next(new AppError('Department not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DEACTIVATED_DEPARTMENT',
      module: 'DEPARTMENTS',
      resourceId: dept._id,
      description: `Admin deactivated department: ${dept.code}`,
      metadata: { departmentId: dept._id, code: dept.code },
    });

    return sendSuccess(res, { message: 'Department deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
