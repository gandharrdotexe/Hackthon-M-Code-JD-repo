const mongoose = require('mongoose');

const RewardHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('RewardHistory', RewardHistorySchema);

