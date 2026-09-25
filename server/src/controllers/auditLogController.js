const AuditLog = require('../models/AuditLog');
const { sendSuccess } = require('../utils/response');

/**
 * auditLogController
 * Immutable audit logs and security monitoring.
 */

// GET /api/audit-logs - Admin only
const getAllAuditLogs = async (req, res, next) => {
  try {
    const { module: mod, search } = req.query;
    const query = {};

    if (mod && mod !== 'All') {
      query.module = mod.toUpperCase();
    }

    let logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    if (search) {
      const s = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action?.toLowerCase().includes(s) ||
          l.description?.toLowerCase().includes(s) ||
          l.user?.name?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, logs);
  } catch (err) {
    next(err);
  }
};

// POST /api/audit-logs - Record audit entry
const logAction = async (user, action, moduleName, description, metadata = null, req = null) => {
  try {
    await AuditLog.create({
      user: user?._id || user || null,
      action: action.toUpperCase(),
      module: moduleName.toUpperCase(),
      description,
      metadata,
      ipAddress: req?.ip || null,
      userAgent: req?.headers?.['user-agent'] || null,
    });
  } catch (e) {
    console.error('Audit log write error:', e.message);
  }
};

module.exports = {
  getAllAuditLogs,
  logAction,
};
