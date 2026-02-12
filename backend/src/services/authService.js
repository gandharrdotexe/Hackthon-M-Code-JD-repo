const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function createAnonymousUser(deviceUuid) {
  if (!deviceUuid) {
    throw new Error('deviceUuid is required');
  }

  let user = await User.findOne({ anonymousId: deviceUuid });
  if (!user) {
    user = await User.create({ anonymousId: deviceUuid });
  }

  const token = signToken(user._id);
  return { user, token };
}

async function upgradeAccount(userId, { email, password }) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (!email || !password) {
    throw new Error('Email and password are required to upgrade');
  }

  const existing = await User.findOne({ email });
  if (existing && existing._id.toString() !== userId.toString()) {
    throw new Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  user.email = email;
  user.passwordHash = passwordHash;
  await user.save();

  const token = signToken(user._id);
  return { user, token };
}

function signToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn });
}

module.exports = { createAnonymousUser, upgradeAccount };

