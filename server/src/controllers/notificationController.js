const Notification = require('../models/Notification');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * notificationController
 * Handles in-app alerts, push notifications, and broadcast messaging.
 */

// GET /api/notifications - Get authenticated user's notifications
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, notifications);
  } catch (err) {
    next(err);
  }
};

// GET /api/notifications/all - Admin view of broadcast notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    return sendSuccess(res, notifications);
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read - Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return next(new AppError('Notification not found.', 404));
    }
    return sendSuccess(res, notification);
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications/broadcast - Admin broadcasts to audience
const broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, audience = 'ALL', type = 'INFO', link } = req.body;
    if (!title || !message) {
      return next(new AppError('Notification title and message are required.', 400));
    }

    const roleQuery = {};
    if (audience === 'STUDENTS' || audience === 'STUDENT' || audience === 'All Students') roleQuery.role = 'STUDENT';
    else if (audience === 'FACULTY' || audience === 'All Faculty') roleQuery.role = 'FACULTY';
    // Otherwise ALL users

    const users = await User.find({ ...roleQuery, isActive: true });
    if (users.length === 0) {
      // Create at least one notification for the sender
      users.push(req.user);
    }

    const notificationsToInsert = users.map((u) => ({
      recipient: u._id,
      recipientType: u.role,
      title,
      message,
      type: type.toUpperCase(),
      link: link || null,
      isRead: false,
    }));

    await Notification.insertMany(notificationsToInsert);

    await logAudit({
      req,
      action: 'ADMIN_BROADCAST_NOTIFICATION',
      module: 'NOTIFICATIONS',
      description: `Admin broadcast notification: "${title}" to ${audience} (${users.length} users)`,
      metadata: { title, audience, recipientCount: users.length },
    });

    return sendSuccess(res, {
      message: `Notification broadcasted to ${users.length} recipients.`,
      count: users.length,
    }, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  getAllNotifications,
  markAsRead,
  broadcastNotification,
};
