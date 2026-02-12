const express = require('express');
const { createAnonymousUser, upgradeAccount } = require('../services/authService');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// POST /auth/anonymous
router.post('/anonymous', async (req, res, next) => {
  try {
    const { deviceUuid } = req.body || {};
    const { user, token } = await createAnonymousUser(deviceUuid);
    res.json({
      token,
      user: {
        id: user._id,
        anonymousId: user.anonymousId,
        gamification: user.gamification
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/upgrade
router.post('/upgrade', authRequired, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const { user, token } = await upgradeAccount(req.user._id, { email, password });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        anonymousId: user.anonymousId,
        gamification: user.gamification
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

