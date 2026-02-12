const mongoose = require('mongoose');

const GamificationSchema = new mongoose.Schema(
  {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLoggedDate: { type: Date, default: null },
    badges: [{ type: String }]
  },
  { _id: false }
);

const ProfileSchema = new mongoose.Schema(
  {
    dob: Date,
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    bmi: Number
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    notificationsEnabled: { type: Boolean, default: true },
    timezone: { type: String, default: 'Asia/Kolkata' }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    anonymousId: { type: String, index: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    profile: ProfileSchema,
    gamification: { type: GamificationSchema, default: () => ({}) },
    settings: { type: SettingsSchema, default: () => ({}) }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);

