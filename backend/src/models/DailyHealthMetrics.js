const mongoose = require('mongoose');

const DailyHealthMetricsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    date: { type: String, index: true }, // YYYY-MM-DD
    steps: Number,
    avgHeartRate: Number,
    sleepHours: Number
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('DailyHealthMetrics', DailyHealthMetricsSchema);

