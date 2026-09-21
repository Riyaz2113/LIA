const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LIA API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
