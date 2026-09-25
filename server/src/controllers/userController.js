const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * userController
 * User accounts directory, role management, and account activation/deactivation.
 */

// GET /api/users - Admin only
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role && role !== 'All' && role !== 'All Users') {
      if (role === 'Admins' || role === 'ADMIN') query.role = 'ADMIN';
      else if (role === 'Faculty' || role === 'FACULTY') query.role = 'FACULTY';
      else if (role === 'Staff') query.role = 'FACULTY';
      else if (role === 'Students' || role === 'STUDENT') query.role = 'STUDENT';
      else query.role = role.toUpperCase();
    }

    if (status && status !== 'All') {
      query.isActive = status === 'Active' || status === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    let users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (search) {
      const s = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.role?.toLowerCase().includes(s) ||
          u.phone?.toLowerCase().includes(s)
      );
    }

    const total = await User.countDocuments(query);

    return sendSuccess(res, users, 200, {
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

// GET /api/users/:id - Admin only
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new AppError('User not found.', 404));
    }
    return sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

// POST /api/users - Admin only
const createUser = async (req, res, next) => {
  try {
    const { name, email, password = 'User@123', role = 'FACULTY', phone = '', isActive = true } = req.body;
    if (!name || !email) {
      return next(new AppError('Name and email are required.', 400));
    }

    const validRoles = ['ADMIN', 'FACULTY', 'STUDENT'];
    const normalizedRole = role.toUpperCase();
    if (!validRoles.includes(normalizedRole)) {
      return next(new AppError(`Invalid role. Allowed roles: ${validRoles.join(', ')}`, 400));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new AppError(`Email ${email} is already registered.`, 409));
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
      phone,
      isActive,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    await logAudit({
      req,
      action: 'ADMIN_CREATED_USER',
      module: 'USERS',
      resourceId: user._id,
      description: `Admin created user ${user.name} (${user.email}) with role ${user.role}`,
      metadata: { userId: user._id, role: user.role, email: user.email },
    });

    return sendSuccess(res, safeUser, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError(`Email ${req.body.email} is already registered.`, 409));
    }
    next(err);
  }
};

// PUT /api/users/:id - Admin only
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, phone, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    // Safety check: Cannot deactivate or demote last active admin
    if (user.role === 'ADMIN' && (isActive === false || (role && role.toUpperCase() !== 'ADMIN'))) {
      const activeAdminCount = await User.countDocuments({ role: 'ADMIN', isActive: true });
      if (activeAdminCount <= 1 && user.isActive) {
        return next(new AppError('Cannot deactivate or reassign the last remaining active Administrator.', 400));
      }
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role) {
      const validRoles = ['ADMIN', 'FACULTY', 'STUDENT'];
      const normalizedRole = role.toUpperCase();
      if (!validRoles.includes(normalizedRole)) {
        return next(new AppError(`Invalid role. Allowed roles: ${validRoles.join(', ')}`, 400));
      }
      user.role = normalizedRole;
    }
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_USER',
      module: 'USERS',
      resourceId: user._id,
      description: `Admin updated user account ${user.name} (${user.email})`,
      metadata: { userId: user._id, role: user.role, isActive: user.isActive },
    });

    return sendSuccess(res, safeUser);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id - Admin only (Safety deactivation/deletion)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    // Safety check: cannot delete last active admin or self
    if (user.role === 'ADMIN') {
      const activeAdminCount = await User.countDocuments({ role: 'ADMIN', isActive: true });
      if (activeAdminCount <= 1) {
        return next(new AppError('Cannot deactivate the last remaining active Administrator.', 400));
      }
    }

    user.isActive = false;
    await user.save();

    await logAudit({
      req,
      action: 'ADMIN_DEACTIVATED_USER',
      module: 'USERS',
      resourceId: user._id,
      description: `Admin deactivated user account ${user.name} (${user.email})`,
      metadata: { userId: user._id, email: user.email },
    });

    return sendSuccess(res, { message: 'User deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
