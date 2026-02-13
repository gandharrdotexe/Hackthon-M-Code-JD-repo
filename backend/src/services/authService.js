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
  if (!userId) {
    throw new Error('User ID is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!email || !password) {
    throw new Error('Email and password are required to upgrade');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Check if email is already in use by another user
  const existing = await User.findOne({ email });
  if (existing && existing._id.toString() !== userId.toString()) {
    throw new Error('Email already in use');
  }

  // If user already has an email, check if it's the same
  if (user.email && user.email === email) {
    // User is just updating password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    user.passwordHash = passwordHash;
    await user.save();
  } else {
    // User is upgrading from anonymous or changing email
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user.email = email;
    user.passwordHash = passwordHash;
    
    try {
      await user.save();
    } catch (saveErr) {
      // Handle duplicate key error specifically
      if (saveErr.code === 11000) {
        throw new Error('Email already in use');
      }
      throw saveErr;
    }
  }

  const token = signToken(user._id);
  return { user, token };
}

function signToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn });
}

module.exports = { createAnonymousUser, upgradeAccount };

