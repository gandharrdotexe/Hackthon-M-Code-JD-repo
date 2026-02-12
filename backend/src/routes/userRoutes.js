const express = require('express');
const { authRequired } = require('../middleware/auth');
const { getProfile, updateProfile, getDailyStatus } = require('../services/userService');

const router = express.Router();

// GET /user/profile
router.get('/profile', authRequired, async (req, res, next) => {
  try {
    const profile = await getProfile(req.user);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /user/profile
router.put('/profile', authRequired, async (req, res, next) => {
  try {
    const profile = await updateProfile(req.user, req.body || {});
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// GET /user/daily-status
router.get('/daily-status', authRequired, async (req, res, next) => {
  try {
    const status = await getDailyStatus(req.user);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

