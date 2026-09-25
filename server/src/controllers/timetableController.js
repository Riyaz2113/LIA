const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const ClassSection = require('../models/ClassSection');
const Student = require('../models/Student');
const Department = require('../models/Department');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * timetableController
 * Live database-driven timetable management across departments, sections, and faculty.
 */

// GET /api/timetable
const getAllTimetable = async (req, res, next) => {
  try {
    const { dayOfWeek, academicYear, semester, faculty, department, section } = req.query;
    const query = { isActive: true };

    if (dayOfWeek) query.dayOfWeek = dayOfWeek.toUpperCase();
    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = Number(semester);
    if (faculty) query.faculty = faculty;

    let slots = await Timetable.find(query)
      .populate('subject', 'name code credits type')
      .populate({
        path: 'faculty',
        select: 'employeeId designation user',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'classSection',
        populate: { path: 'department', select: 'name code' },
      })
      .sort({ startTime: 1 });

    // Optional filter by department code or section if classSection populated
    if (department) {
      const d = department.toUpperCase();
      slots = slots.filter((s) => s.classSection?.department?.code === d || s.classSection?.department?._id?.toString() === department);
    }
    if (section) {
      const sec = section.toUpperCase();
      slots = slots.filter((s) => s.classSection?.section === sec);
    }

    return sendSuccess(res, slots);
  } catch (err) {
    next(err);
  }
};

// GET /api/timetable/student - Student schedule
const getStudentSchedule = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return next(new AppError('Student profile not found.', 404));
    }

    // Find class section matching student's department, year, semester, section
    let classSection = await ClassSection.findOne({
      department: student.department,
      year: student.year,
      semester: student.semester,
      section: student.section,
    });

    let query = { isActive: true, semester: student.semester };
    if (classSection) {
      query.classSection = classSection._id;
    }

    const slots = await Timetable.find(query)
      .populate('subject', 'name code credits type')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ startTime: 1 });

    return sendSuccess(res, slots);
  } catch (err) {
    next(err);
  }
};

// GET /api/timetable/faculty - Faculty schedule
const getFacultySchedule = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return next(new AppError('Faculty profile not found.', 404));
    }

    const slots = await Timetable.find({ faculty: faculty._id, isActive: true })
      .populate('subject', 'name code credits type')
      .populate({
        path: 'classSection',
        populate: { path: 'department', select: 'name code' },
      })
      .sort({ dayOfWeek: 1, startTime: 1 });

    return sendSuccess(res, slots);
  } catch (err) {
    next(err);
  }
};

// POST /api/timetable - Admin only
const createTimetableSlot = async (req, res, next) => {
  try {
    const {
      classSection,
      department,
      year = 3,
      semester = 1,
      section = 'A',
      subject,
      faculty,
      dayOfWeek,
      startTime,
      endTime,
      room = 'Room 204',
      academicYear = '2026-27',
    } = req.body;

    if (!subject || !dayOfWeek || !startTime || !endTime) {
      return next(new AppError('Subject, day, start time, and end time are required.', 400));
    }

    // Resolve Subject ID
    let subjectId = subject;
    if (!subject.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const subjDoc = await Subject.findOne({ code: subject.toUpperCase() });
      if (!subjDoc) return next(new AppError(`Subject ${subject} not found.`, 404));
      subjectId = subjDoc._id;
    }

    // Resolve Faculty ID if provided
    let facultyId = faculty;
    if (faculty && !faculty.toString().match(/^[0-9a-fA-F]{24}$/)) {
      const facDoc = await Faculty.findOne({ employeeId: faculty.toUpperCase() });
      if (facDoc) facultyId = facDoc._id;
      else {
        const anyFac = await Faculty.findOne();
        facultyId = anyFac ? anyFac._id : null;
      }
    } else if (!facultyId) {
      const anyFac = await Faculty.findOne();
      facultyId = anyFac ? anyFac._id : null;
    }

    // Resolve or Auto-create ClassSection
    let classSectionId = classSection;
    if (!classSectionId) {
      let deptId = department;
      if (department && !department.toString().match(/^[0-9a-fA-F]{24}$/)) {
        const deptDoc = await Department.findOne({ code: department.toUpperCase() });
        if (deptDoc) deptId = deptDoc._id;
      }
      if (!deptId) {
        const defaultDept = await Department.findOne();
        deptId = defaultDept ? defaultDept._id : null;
      }

      let cs = await ClassSection.findOne({
        department: deptId,
        year: Number(year),
        semester: Number(semester),
        section: section.toUpperCase(),
        academicYear,
      });

      if (!cs) {
        cs = await ClassSection.create({
          department: deptId,
          course: deptId, // fallback ref
          year: Number(year),
          semester: Number(semester),
          section: section.toUpperCase(),
          academicYear,
        });
      }
      classSectionId = cs._id;
    }

    const slot = await Timetable.create({
      classSection: classSectionId,
      subject: subjectId,
      faculty: facultyId,
      dayOfWeek: dayOfWeek.toUpperCase(),
      startTime,
      endTime,
      room,
      academicYear,
      semester: Number(semester),
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_TIMETABLE',
      module: 'TIMETABLE',
      resourceId: slot._id,
      description: `Admin created timetable slot: ${dayOfWeek.toUpperCase()} ${startTime}-${endTime} in ${room}`,
      metadata: { slotId: slot._id, dayOfWeek: slot.dayOfWeek, room: slot.room },
    });

    const populated = await Timetable.findById(slot._id)
      .populate('subject', 'name code credits type')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'classSection',
        populate: { path: 'department', select: 'name code' },
      });

    return sendSuccess(res, populated, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/timetable/:id - Admin only
const updateTimetableSlot = async (req, res, next) => {
  try {
    const { subject, faculty, dayOfWeek, startTime, endTime, room, academicYear, semester } = req.body;
    const slot = await Timetable.findById(req.params.id);

    if (!slot) {
      return next(new AppError('Timetable slot not found.', 404));
    }

    if (dayOfWeek) slot.dayOfWeek = dayOfWeek.toUpperCase();
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (room !== undefined) slot.room = room;
    if (academicYear) slot.academicYear = academicYear;
    if (semester) slot.semester = Number(semester);

    if (subject) {
      if (subject.toString().match(/^[0-9a-fA-F]{24}$/)) {
        slot.subject = subject;
      } else {
        const subjDoc = await Subject.findOne({ code: subject.toUpperCase() });
        if (subjDoc) slot.subject = subjDoc._id;
      }
    }

    if (faculty) {
      if (faculty.toString().match(/^[0-9a-fA-F]{24}$/)) {
        slot.faculty = faculty;
      } else {
        const facDoc = await Faculty.findOne({ employeeId: faculty.toUpperCase() });
        if (facDoc) slot.faculty = facDoc._id;
      }
    }

    await slot.save();

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_TIMETABLE',
      module: 'TIMETABLE',
      resourceId: slot._id,
      description: `Admin updated timetable slot: ${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`,
      metadata: { slotId: slot._id, dayOfWeek: slot.dayOfWeek, room: slot.room },
    });

    const populated = await Timetable.findById(slot._id)
      .populate('subject', 'name code credits type')
      .populate({
        path: 'faculty',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'classSection',
        populate: { path: 'department', select: 'name code' },
      });

    return sendSuccess(res, populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/timetable/:id - Admin only
const deleteTimetableSlot = async (req, res, next) => {
  try {
    const slot = await Timetable.findByIdAndDelete(req.params.id);
    if (!slot) {
      return next(new AppError('Timetable slot not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_TIMETABLE',
      module: 'TIMETABLE',
      resourceId: req.params.id,
      description: `Admin deleted timetable slot: ${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`,
      metadata: { dayOfWeek: slot.dayOfWeek, room: slot.room },
    });

    return sendSuccess(res, { message: 'Timetable slot removed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTimetable,
  getStudentSchedule,
  getFacultySchedule,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
};
