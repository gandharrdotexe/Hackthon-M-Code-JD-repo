const mongoose = require('mongoose');

const SugarLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true }, // chai, sweets, cold drink, etc.
    method: {
      type: String,
      enum: ['preset', 'photo', 'voice'],
      default: 'preset'
    },
    sugarEstimate: { type: Number, required: true }, // grams
    timeOfDay: { type: String }, // morning/afternoon/evening/night
    contextSnapshot: {
      steps: Number,
      sleepHours: Number,
      heartRate: Number
    },
    generatedInsight: { type: String },
    suggestedAction: { type: String },
    actionCompleted: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('SugarLog', SugarLogSchema);

