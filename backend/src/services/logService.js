const SugarLog = require('../models/SugarLog');
const DailyHealthMetrics = require('../models/DailyHealthMetrics');
const { generateInsight } = require('./insightEngine');
const { generateSuggestion } = require('./suggestionEngine');
const { calculateXp, updateStreak } = require('./gamificationService');
const { generateReward } = require('./rewardService');

function getTodayDateString() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function inferTimeOfDay(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

function defaultSugarEstimate(type) {
  const map = {
    chai: 8,
    sweets: 20,
    'cold drink': 25
  };
  return map[type?.toLowerCase()] || 15;
}

async function logSugarEvent(user, payload) {
  const { type, method = 'preset', sugarEstimate, contextSnapshot = {} } = payload || {};
  if (!type) {
    throw new Error('type is required');
  }

  const estimate = typeof sugarEstimate === 'number' ? sugarEstimate : defaultSugarEstimate(type);
  const timeOfDay = payload.timeOfDay || inferTimeOfDay();

  // Fetch today's health metrics
  const today = getTodayDateString();
  const todayMetrics = await DailyHealthMetrics.findOne({
    userId: user._id,
    date: today
  });

  const mergedContext = {
    steps: todayMetrics?.steps ?? contextSnapshot.steps,
    sleepHours: todayMetrics?.sleepHours ?? contextSnapshot.sleepHours,
    heartRate: todayMetrics?.avgHeartRate ?? contextSnapshot.heartRate
  };

  const generatedInsight = generateInsight({
    sugarEstimate: estimate,
    timeOfDay,
    contextSnapshot: mergedContext
  });

  const suggestedAction = generateSuggestion({
    timeOfDay,
    contextSnapshot: mergedContext
  });

  // Gamification: streak + XP
  const streakUpdate = updateStreak(user.gamification, new Date());
  const { xp, bonus } = calculateXp({
    timeOfDay,
    actionCompleted: false,
    isStreakMilestone: streakUpdate.isStreakMilestone
  });

  const totalXp = (user.gamification?.xp || 0) + xp;
  const level = 1 + Math.floor(totalXp / 100); // simple leveling

  user.gamification = {
    ...(user.gamification || {}),
    xp: totalXp,
    level,
    streak: streakUpdate.streak,
    longestStreak: streakUpdate.longestStreak,
    lastLoggedDate: streakUpdate.lastLoggedDate
  };
  await user.save();

  const log = await SugarLog.create({
    userId: user._id,
    type,
    method,
    sugarEstimate: estimate,
    timeOfDay,
    contextSnapshot: mergedContext,
    generatedInsight,
    suggestedAction,
    xpEarned: xp
  });

  const reward = await generateReward(user._id, xp + bonus);

  return {
    log,
    insight: generatedInsight,
    suggestion: suggestedAction,
    xpEarned: xp,
    reward
  };
}

async function getHistory(userId, limit = 20) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Ensure limit is a valid positive number
  const validLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

  // Ensure userId is properly formatted (Mongoose handles ObjectId conversion automatically)
  const logs = await SugarLog.find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(validLimit)
    .lean(); // Use lean() for better performance when just reading data

  return logs;
}

async function markActionComplete(user, logId) {
  const log = await SugarLog.findOne({ _id: logId, userId: user._id });
  if (!log) {
    throw new Error('Log not found');
  }
  if (log.actionCompleted) {
    return log;
  }

  log.actionCompleted = true;

  // Grant XP for completing action
  const { xp } = calculateXp({
    timeOfDay: log.timeOfDay,
    actionCompleted: true,
    isStreakMilestone: false
  });

  log.xpEarned += xp;

  const totalXp = (user.gamification?.xp || 0) + xp;
  const level = 1 + Math.floor(totalXp / 100);

  user.gamification = {
    ...(user.gamification || {}),
    xp: totalXp,
    level
  };

  await Promise.all([log.save(), user.save()]);
  return log;
}

module.exports = { logSugarEvent, getHistory, markActionComplete };

