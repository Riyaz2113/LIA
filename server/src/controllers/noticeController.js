const Notice = require('../models/Notice');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * noticeController
 * Official campus announcements & circulars CMS.
 */

// GET /api/notices
const getAllNotices = async (req, res, next) => {
  try {
    const { category, isPublished, search } = req.query;
    const query = {};

    // For public / non-admin users, only return published notices
    if (!req.user || req.user.role !== 'ADMIN') {
      query.isPublished = true;
    } else if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    if (category && category !== 'All') {
      query.category = category.toUpperCase();
    }

    let notices = await Notice.find(query)
      .populate('createdBy', 'name role')
      .sort({ publishDate: -1, createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      notices = notices.filter(
        (n) =>
          n.title?.toLowerCase().includes(s) ||
          n.description?.toLowerCase().includes(s) ||
          n.category?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, notices);
  } catch (err) {
    next(err);
  }
};

// GET /api/notices/:id
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('createdBy', 'name role');
    if (!notice) {
      return next(new AppError('Notice not found.', 404));
    }
    return sendSuccess(res, notice);
  } catch (err) {
    next(err);
  }
};

// POST /api/notices - Admin only
const createNotice = async (req, res, next) => {
  try {
    const { title, description, category = 'GENERAL', priority = 'NORMAL', isPublished = true, image, attachment } = req.body;
    if (!title || !description) {
      return next(new AppError('Notice title and description are required.', 400));
    }

    const notice = await Notice.create({
      title,
      description,
      category: category.toUpperCase(),
      priority: priority.toUpperCase(),
      isPublished,
      image,
      attachment,
      createdBy: req.user._id,
      publishDate: new Date(),
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_NOTICE',
      module: 'NOTICES',
      resourceId: notice._id,
      description: `Admin created notice: "${title}" [${category.toUpperCase()}]`,
      metadata: { noticeId: notice._id, title, category: notice.category },
    });

    const populated = await Notice.findById(notice._id).populate('createdBy', 'name role');
    return sendSuccess(res, populated, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/notices/:id - Admin only
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name role');

    if (!notice) {
      return next(new AppError('Notice not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_NOTICE',
      module: 'NOTICES',
      resourceId: notice._id,
      description: `Admin updated notice: "${notice.title}"`,
      metadata: { noticeId: notice._id, title: notice.title },
    });

    return sendSuccess(res, notice);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notices/:id - Admin only
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return next(new AppError('Notice not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_NOTICE',
      module: 'NOTICES',
      resourceId: req.params.id,
      description: `Admin deleted notice: "${notice.title}"`,
      metadata: { title: notice.title },
    });

    return sendSuccess(res, { message: 'Notice deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
