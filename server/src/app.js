const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const studentsRouter = require('./routes/students');
const facultyRouter = require('./routes/faculty');
const departmentsRouter = require('./routes/departments');
const subjectsRouter = require('./routes/subjects');
const timetableRouter = require('./routes/timetable');
const attendanceRouter = require('./routes/attendance');
const examsRouter = require('./routes/exams');
const marksRouter = require('./routes/marks');
const noticesRouter = require('./routes/notices');
const eventsRouter = require('./routes/events');
const placementsRouter = require('./routes/placements');
const materialsRouter = require('./routes/materials');
const libraryRouter = require('./routes/library');
const mediaRouter = require('./routes/media');
const notificationsRouter = require('./routes/notifications');
const dashboardRouter = require('./routes/dashboard');
const auditLogsRouter = require('./routes/auditLogs');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// credentials: true is required for HTTP-only cookie authentication to work
// across the frontend (http://localhost:5173 / http://127.0.0.1:5173) and backend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, origin); // Reflect origin if valid
      }
    },
    credentials: true, // Required for cross-origin cookie sending
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Cookie Parser ────────────────────────────────────────────────────────────
// Parses incoming cookies and populates req.cookies
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/timetable', timetableRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/exams', examsRouter);
app.use('/api/marks', marksRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/placements', placementsRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/library', libraryRouter);
app.use('/api/media', mediaRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/chat', chatRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Central Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
