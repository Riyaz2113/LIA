const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// credentials: true is required for HTTP-only cookie authentication to work
// across the frontend (http://localhost:5173) and backend (http://localhost:5000)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
