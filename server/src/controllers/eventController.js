const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/response');
const { logAudit } = require('../utils/auditLogger');

/**
 * eventController
 * Campus fests, technical workshops, cultural activities, and event management.
 */

// GET /api/events
const getAllEvents = async (req, res, next) => {
  try {
    const { category, status, search, timeline } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category.toUpperCase();
    if (status && status !== 'All') query.status = status.toUpperCase();

    if (timeline === 'upcoming') {
      query.date = { $gte: new Date() };
    } else if (timeline === 'past') {
      query.date = { $lt: new Date() };
    }

    let events = await Event.find(query).sort({ date: 1 });

    if (search) {
      const s = search.toLowerCase();
      events = events.filter(
        (ev) =>
          ev.title?.toLowerCase().includes(s) ||
          ev.venue?.toLowerCase().includes(s) ||
          ev.organizer?.toLowerCase().includes(s) ||
          ev.description?.toLowerCase().includes(s)
      );
    }

    return sendSuccess(res, events);
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new AppError('Event not found.', 404));
    }
    return sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
};

// POST /api/events - Admin only
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description = '',
      category = 'TECHNICAL',
      date,
      startTime = '09:30',
      endTime = '16:30',
      venue = 'Main Auditorium',
      organizer = "Vignan's Lara",
      status = 'UPCOMING',
      isPublished = true,
      image,
    } = req.body;

    if (!title || !date) {
      return next(new AppError('Event title and date are required.', 400));
    }

    const event = await Event.create({
      title,
      description,
      category: category.toUpperCase(),
      date: new Date(date),
      startTime,
      endTime,
      venue,
      organizer,
      status: status.toUpperCase(),
      isPublished,
      image,
    });

    await logAudit({
      req,
      action: 'ADMIN_CREATED_EVENT',
      module: 'EVENTS',
      resourceId: event._id,
      description: `Admin created event: "${title}" [${category.toUpperCase()}]`,
      metadata: { eventId: event._id, title, date: event.date },
    });

    return sendSuccess(res, event, 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/events/:id - Admin only
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return next(new AppError('Event not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_UPDATED_EVENT',
      module: 'EVENTS',
      resourceId: event._id,
      description: `Admin updated event: "${event.title}"`,
      metadata: { eventId: event._id, title: event.title },
    });

    return sendSuccess(res, event);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:id - Admin only
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return next(new AppError('Event not found.', 404));
    }

    await logAudit({
      req,
      action: 'ADMIN_DELETED_EVENT',
      module: 'EVENTS',
      resourceId: req.params.id,
      description: `Admin deleted event: "${event.title}"`,
      metadata: { title: event.title },
    });

    return sendSuccess(res, { message: 'Event deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
