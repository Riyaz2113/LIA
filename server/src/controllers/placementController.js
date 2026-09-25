const PlacementDrive = require('../models/PlacementDrive');
const Company = require('../models/Company');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * placementController
 * Handles recruitment drives, company listings, and student placement applications.
 */

// GET /api/placements/drives
const getAllDrives = async (req, res, next) => {
  try {
    const { status, year, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status.toUpperCase();
    }

    let drives = await PlacementDrive.find(query)
      .populate('company', 'name industry website logo')
      .populate('eligibleDepartments', 'name code')
      .sort({ driveDate: 1, createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      drives = drives.filter(
        (d) =>
          d.jobTitle?.toLowerCase().includes(s) ||
          d.company?.name?.toLowerCase().includes(s) ||
          d.eligibility?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, drives);
  } catch (err) {
    next(err);
  }
};

// GET /api/placements/drives/:id
const getDriveById = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      .populate('company')
      .populate('eligibleDepartments');

    if (!drive) {
      return next(new AppError('Placement drive not found.', 404));
    }
    return sendSuccess(res, drive);
  } catch (err) {
    next(err);
  }
};

// POST /api/placements/drives - Admin only
const createDrive = async (req, res, next) => {
  try {
    const {
      company,
      jobTitle,
      description = '',
      eligibility = 'B.Tech (All)',
      package: pkg = '7.0 LPA',
      location = 'On-Campus',
      driveDate,
      applicationDeadline,
      status = 'UPCOMING',
    } = req.body;

    if (!company || !jobTitle) {
      return next(new AppError('Company name and job title are required.', 400));
    }

    // Resolve or Auto-create Company
    let companyId = company;
    let companyName = company;
    if (!company.toString().match(/^[0-9a-fA-F]{24}$/)) {
      let companyDoc = await Company.findOne({ name: new RegExp(`^${company}$`, 'i') });
      if (!companyDoc) {
        companyDoc = await Company.create({
          name: company,
          industry: 'Information Technology',
        });
      }
      companyId = companyDoc._id;
      companyName = companyDoc.name;
    }

    const drive = await PlacementDrive.create({
      company: companyId,
      jobTitle,
      description,
      eligibility,
      package: pkg,
      location,
      driveDate: driveDate ? new Date(driveDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: status.toUpperCase(),
      createdBy: req.user._id,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_PLACEMENT_DRIVE',
      module: 'PLACEMENTS',
      resourceId: drive._id,
      description: `Admin created placement drive for ${companyName} (${jobTitle})`,
      metadata: { driveId: drive._id, jobTitle, package: pkg },
    });

    const populated = await PlacementDrive.findById(drive._id).populate('company');
    return sendSuccess(res, populated, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/placements/drives/:id - Admin only
const updateDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('company');

    if (!drive) {
      return next(new AppError('Placement drive not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_PLACEMENT_DRIVE',
      module: 'PLACEMENTS',
      resourceId: drive._id,
      description: `Admin updated placement drive: ${drive.jobTitle}`,
      metadata: { driveId: drive._id, jobTitle: drive.jobTitle, status: drive.status },
    });

    return sendSuccess(res, drive);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/placements/drives/:id - Admin only
const deleteDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
    if (!drive) {
      return next(new AppError('Placement drive not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_PLACEMENT_DRIVE',
      module: 'PLACEMENTS',
      resourceId: req.params.id,
      description: `Admin deleted placement drive: ${drive.jobTitle}`,
      metadata: { jobTitle: drive.jobTitle },
    });

    return sendSuccess(res, { message: 'Placement drive removed successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/placements/companies
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isActive: true }).sort({ name: 1 });
    return sendSuccess(res, companies);
  } catch (err) {
    next(err);
  }
};

// POST /api/placements/companies - Admin only
const createCompany = async (req, res, next) => {
  try {
    const { name, industry = 'Information Technology', website = '', logo = '', description = '' } = req.body;
    if (!name) {
      return next(new AppError('Company name is required.', 400));
    }

    const company = await Company.create({
      name,
      industry,
      website,
      logo,
      description,
      isActive: true,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_COMPANY',
      module: 'PLACEMENTS',
      resourceId: company._id,
      description: `Admin created partner company: ${name}`,
      metadata: { companyId: company._id, name },
    });

    return sendSuccess(res, company, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError(`Company ${req.body.name} already exists.`, 409));
    }
    next(err);
  }
};

module.exports = {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  getAllCompanies,
  createCompany,
};
