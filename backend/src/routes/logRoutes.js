const express = require('express');
const { authRequired } = require('../middleware/auth');
const { logSugarEvent, getHistory, markActionComplete } = require('../services/logService');

const router = express.Router();

// POST /logs/sugar
router.post('/sugar', authRequired, async (req, res, next) => {
  try {
    const result = await logSugarEvent(req.user, req.body || {});
    res.json({
      log: result.log,
      insight: result.insight,
      suggestion: result.suggestion,
      xpEarned: result.xpEarned,
      reward: result.reward
    });
  } catch (err) {
    next(err);
  }
});

// GET /logs/history
router.get('/history', authRequired, async (req, res, next) => {
  try {
    // Validate and sanitize limit parameter
    let limit = parseInt(req.query.limit, 10) || 20;
    if (isNaN(limit) || limit < 1) {
      limit = 20;
    }
    if (limit > 100) {
      limit = 100; // Cap at 100 for performance
    }

    const logs = await getHistory(req.user._id, limit);
    
    // Disable caching for dynamic log data
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// POST /logs/action-complete
router.post('/action-complete', authRequired, async (req, res, next) => {
  try {
    const { logId } = req.body || {};
    const log = await markActionComplete(req.user, logId);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

