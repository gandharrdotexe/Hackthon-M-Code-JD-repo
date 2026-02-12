const express = require('express');
const { authRequired } = require('../middleware/auth');
const { syncHealthMetrics } = require('../services/healthService');

const router = express.Router();

// POST /health/sync
router.post('/sync', authRequired, async (req, res, next) => {
  try {
    const result = await syncHealthMetrics(req.user._id, req.body || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

