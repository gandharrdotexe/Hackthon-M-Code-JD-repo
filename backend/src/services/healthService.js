const DailyHealthMetrics = require('../models/DailyHealthMetrics');

function getDateStringFromDate(date) {
  return date.toISOString().slice(0, 10);
}

async function syncHealthMetrics(userId, payload) {
  const { steps, avgHeartRate, sleepHours, date } = payload || {};

  const targetDate =
    typeof date === 'string' && date.length >= 10
      ? date.slice(0, 10)
      : getDateStringFromDate(new Date());

  const doc = await DailyHealthMetrics.findOneAndUpdate(
    { userId, date: targetDate },
    {
      $set: {
        steps,
        avgHeartRate,
        sleepHours
      }
    },
    { new: true, upsert: true }
  );

  // Do not expose raw biometric values beyond confirmation if you want to be strict;
  // here we just confirm sync.
  return {
    date: doc.date,
    synced: true
  };
}

module.exports = { syncHealthMetrics };

