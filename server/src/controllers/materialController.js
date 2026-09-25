const StudyMaterial = require('../models/StudyMaterial');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const ClassSection = require('../models/ClassSection');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * materialController
 * Handles academic study materials, lecture slides, and notes.
 */

// GET /api/materials
const getAllMaterials = async (req, res, next) => {
  try {
    const { subject, category, search, includeUnpublished } = req.query;
    const query = includeUnpublished === 'true' && req.user?.role === 'ADMIN' ? {} : { isPublished: true };

    if (category && category !== 'All') query.category = category.toUpperCase();

    let materials = await StudyMaterial.find(query)
      .populate('subject', 'name code department')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      })
      .populate({
        path: 'classSection',
        populate: { path: 'department', select: 'name code' },
      })
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      materials = materials.filter(
        (m) =>
          m.title?.toLowerCase().includes(s) ||
          m.subject?.name?.toLowerCase().includes(s) ||
          m.subject?.code?.toLowerCase().includes(s) ||
          m.description?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, materials);
  } catch (err) {
    next(err);
  }
};

// GET /api/materials/:id
const getMaterialById = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id)
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      });

    if (!material) {
      return next(new AppError('Material not found.', 404));
    }
    return sendSuccess(res, material);
  } catch (err) {
    next(err);
  }
};

// POST /api/materials - Faculty/Admin uploads
const createMaterial = async (req, res, next) => {
  try {
    const {
      title,
      description = '',
      subject,
      fileUrl = 'https://vlits.edu.in/resources/sample-handout.pdf',
      fileType = 'PDF',
      fileSize = 1048576,
      category = 'NOTES',
      isPublished = true,
    } = req.body;

    if (!title || !subject) {
      return next(new AppError('Title and subject are required.', 400));
    }

    let subjectId = subject;
    if (!subject.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const subjDoc = await Subject.findOne({ code: subject.toUpperCase() });
      if (subjDoc) subjectId = subjDoc._id;
      else {
        const anySubj = await Subject.findOne();
        subjectId = anySubj ? anySubj._id : null;
      }
    }

    let facultyDoc = await Faculty.findOne({ user: req.user._id });
    let facultyId = facultyDoc ? facultyDoc._id : null;
    if (!facultyId) {
      const anyFac = await Faculty.findOne();
      facultyId = anyFac ? anyFac._id : null;
    }

    const defaultClassSection = await ClassSection.findOne();
    const classSectionId = defaultClassSection ? defaultClassSection._id : null;

    const material = await StudyMaterial.create({
      title,
      description,
      subject: subjectId,
      faculty: facultyId,
      classSection: classSectionId,
      fileUrl,
      fileType: fileType.toUpperCase(),
      fileSize,
      category: category.toUpperCase(),
      isPublished,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_STUDY_MATERIAL',
      module: 'MATERIALS',
      resourceId: material._id,
      description: `Created study material: "${title}"`,
      metadata: { materialId: material._id, title, category: material.category },
    });

    const populated = await StudyMaterial.findById(material._id)
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      });

    return sendSuccess(res, populated, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/materials/:id - Faculty/Admin
const updateMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('subject', 'name code')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name' },
      });

    if (!material) {
      return next(new AppError('Material not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_STUDY_MATERIAL',
      module: 'MATERIALS',
      resourceId: material._id,
      description: `Updated study material: "${material.title}"`,
      metadata: { materialId: material._id, title: material.title },
    });

    return sendSuccess(res, material);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/materials/:id - Faculty/Admin
const deleteMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) {
      return next(new AppError('Material not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_STUDY_MATERIAL',
      module: 'MATERIALS',
      resourceId: req.params.id,
      description: `Deleted study material: "${material.title}"`,
      metadata: { title: material.title },
    });

    return sendSuccess(res, { message: 'Material deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
