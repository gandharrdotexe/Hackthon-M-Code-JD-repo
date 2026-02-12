const RewardHistory = require('../models/RewardHistory');

/**
 * Variable reward system with weighted randomness.
 */
async function generateReward(userId, xpGained) {
  // Simple weighted rewards based on XP just earned
  const rewards = [
    { type: 'coin', value: 1, weight: 40 },
    { type: 'coin', value: 2, weight: 30 },
    { type: 'coin', value: 5, weight: 20 },
    { type: 'badge', value: 0, weight: 10 }
  ];

  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  const rand = Math.random() * totalWeight;
  let acc = 0;
  let chosen = rewards[0];

  for (const r of rewards) {
    acc += r.weight;
    if (rand <= acc) {
      chosen = r;
      break;
    }
  }

  const description =
    chosen.type === 'badge'
      ? 'You unlocked a surprise badge for showing up today!'
      : `You earned ${chosen.value} bonus coins for logging and taking action.`;

  const reward = await RewardHistory.create({
    userId,
    type: chosen.type,
    value: chosen.value,
    description
  });

  return reward;
}

module.exports = { generateReward };

