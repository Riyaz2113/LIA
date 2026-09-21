const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * AuditLog
 * Immutable record of significant actions performed across the platform.
 * Used by the Admin Portal for accountability and security monitoring.
 *
 * Examples of logged actions:
 *   ADMIN_UPDATED_HERO
 *   ADMIN_CREATED_NOTICE
 *   ADMIN_DELETED_EVENT
 *   FACULTY_UPDATED_MARKS
 *   ADMIN_UPLOADED_DOCUMENT
 *
 * NOTE: AuditLog documents should NEVER be deleted or updated once created.
 * There is intentionally no updatedAt — timestamps: false.
 */
const auditLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // null for SYSTEM-generated actions
      default: null,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      uppercase: true,
      maxlength: [100, 'Action cannot exceed 100 characters'],
      // e.g. "ADMIN_UPDATED_HERO", "FACULTY_UPDATED_MARKS"
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      trim: true,
      uppercase: true,
      maxlength: [50, 'Module cannot exceed 50 characters'],
      // e.g. "SITE_CONTENT", "MARKS", "ATTENDANCE", "PLACEMENT"
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      // The _id of the affected document (e.g. the Notice _id that was edited)
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      // Additional structured context, e.g. { before: {...}, after: {...} }
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: [45, 'IP address cannot exceed 45 characters'],
      // Supports both IPv4 and IPv6
      default: null,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: [500, 'User agent cannot exceed 500 characters'],
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Audit timestamps must never change
    },
  },
  {
    timestamps: false, // Only createdAt — audit logs are immutable, no updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ module: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 }); // Admin audit log dashboard (newest first)

module.exports = mongoose.model('AuditLog', auditLogSchema);
