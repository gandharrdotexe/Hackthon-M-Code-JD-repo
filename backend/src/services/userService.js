const SugarLog = require('../models/SugarLog');

async function getProfile(user) {
  return {
    id: user._id,
    anonymousId: user.anonymousId,
    email: user.email,
    profile: user.profile,
    gamification: user.gamification,
    settings: user.settings,
    createdAt: user.createdAt
  };
}

async function updateProfile(user, updates) {
  const allowedProfileFields = ['dob', 'age', 'height', 'weight', 'gender', 'bmi'];
  const profile = user.profile || {};
  for (const key of allowedProfileFields) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      profile[key] = updates[key];
    }
  }
  user.profile = profile;
  await user.save();
  return getProfile(user);
}

async function getDailyStatus(user) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const hasLoggedToday = await SugarLog.exists({
    userId: user._id,
    createdAt: {
      $gte: new Date(`${todayStr}T00:00:00.000Z`),
      $lte: new Date(`${todayStr}T23:59:59.999Z`)
    }
  });

  const streak = user.gamification?.streak || 0;

  // Simple progress % based on streak, capped at 100
  const progressPercent = Math.min(100, streak * 10);

  let motivationalCopy = 'Every log is a small win for future you.';
  if (!hasLoggedToday) {
    motivationalCopy = 'Log your sugar today to keep your awareness streak alive.';
  } else if (streak >= 3) {
    motivationalCopy = 'Nice streak! You are building a powerful habit loop.';
  }

  return {
    hasLoggedToday: !!hasLoggedToday,
    streak,
    progressPercent,
    motivationalCopy
  };
}

module.exports = { getProfile, updateProfile, getDailyStatus };

