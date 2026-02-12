const crypto = require('crypto');

function calculateXp({ timeOfDay, actionCompleted, isStreakMilestone }) {
  let xp = 0;

  // Log sugar
  xp += 2;

  // Before 6 PM
  if (timeOfDay === 'morning' || timeOfDay === 'afternoon') {
    xp += 3;
  }

  if (actionCompleted) {
    xp += 7;
  }

  if (isStreakMilestone) {
    xp += 5;
  }

  // Surprise bonus 2–10
  const bonus = 2 + (crypto.randomInt ? crypto.randomInt(0, 9) : Math.floor(Math.random() * 9));
  xp += bonus;

  return { xp, bonus };
}

function updateStreak(gamification, logDate) {
  const current = gamification || {};
  const today = new Date(logDate);
  const last = current.lastLoggedDate ? new Date(current.lastLoggedDate) : null;

  let streak = current.streak || 0;

  if (!last) {
    streak = 1;
  } else {
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  const longestStreak = Math.max(current.longestStreak || 0, streak);
  const isStreakMilestone = streak > (current.streak || 0) && (streak % 3 === 0);

  return {
    streak,
    longestStreak,
    lastLoggedDate: today,
    isStreakMilestone
  };
}

module.exports = { calculateXp, updateStreak };

