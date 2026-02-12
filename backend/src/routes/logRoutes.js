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
    const limit = parseInt(req.query.limit, 10) || 20;
    const logs = await getHistory(req.user._id, limit);
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

