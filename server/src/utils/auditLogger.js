const AuditLog = require('../models/AuditLog');

/**
 * Safely create an immutable audit log entry.
 * Runs asynchronously without blocking the main response if desired,
 * but catches and logs any errors.
 */
const logAudit = async ({ req, action, module, resourceId = null, description = '', metadata = null }) => {
  try {
    const user = req && req.user ? req.user._id : null;
    const ipAddress = req
      ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim()
      : null;
    const userAgent = req && req.headers ? req.headers['user-agent'] : null;

    const log = await AuditLog.create({
      user,
      action: action.toUpperCase(),
      module: module.toUpperCase(),
      resourceId,
      description,
      metadata,
      ipAddress: ipAddress ? ipAddress.slice(0, 45) : null,
      userAgent: userAgent ? userAgent.slice(0, 500) : null,
    });
    return log;
  } catch (err) {
    console.error(`[AUDIT_LOG_ERROR] Failed to record audit log for action ${action}:`, err.message);
    return null;
  }
};

module.exports = { logAudit };
