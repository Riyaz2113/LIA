const Media = require('../models/Media');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * mediaController
 * Handles campus gallery assets, photo highlights, and hero banner media.
 */

// GET /api/media
const getAllMedia = async (req, res, next) => {
  try {
    const { category, includeUnpublished } = req.query;
    const query = includeUnpublished === 'true' && req.user?.role === 'ADMIN' ? {} : { isPublished: true };

    if (category && category !== 'All') {
      query.category = category.toUpperCase();
    }

    const mediaList = await Media.find(query).sort({ displayOrder: 1, createdAt: -1 });
    return sendSuccess(res, mediaList);
  } catch (err) {
    next(err);
  }
};

// GET /api/media/:id
const getMediaById = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return next(new AppError('Media asset not found.', 404));
    }
    return sendSuccess(res, media);
  } catch (err) {
    next(err);
  }
};

// POST /api/media - Admin only
const createMedia = async (req, res, next) => {
  try {
    const { title, description = '', url, thumbnail, category = 'CAMPUS', displayOrder = 0, isPublished = true } = req.body;
    if (!title || !url) {
      return next(new AppError('Media title and URL are required.', 400));
    }

    const media = await Media.create({
      title,
      description,
      url,
      thumbnail: thumbnail || url,
      category: category.toUpperCase(),
      displayOrder: Number(displayOrder),
      isPublished,
      uploadedBy: req.user._id,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_MEDIA',
      module: 'GALLERY',
      resourceId: media._id,
      description: `Admin created media asset: "${title}" [${media.category}]`,
      metadata: { mediaId: media._id, title, category: media.category },
    });

    return sendSuccess(res, media, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/media/:id - Admin only
const updateMedia = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!media) {
      return next(new AppError('Media asset not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_MEDIA',
      module: 'GALLERY',
      resourceId: media._id,
      description: `Admin updated media asset: "${media.title}"`,
      metadata: { mediaId: media._id, title: media.title },
    });

    return sendSuccess(res, media);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/media/:id - Admin only
const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return next(new AppError('Media asset not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_MEDIA',
      module: 'GALLERY',
      resourceId: req.params.id,
      description: `Admin deleted media asset: "${media.title}"`,
      metadata: { title: media.title },
    });

    return sendSuccess(res, { message: 'Media removed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
};
