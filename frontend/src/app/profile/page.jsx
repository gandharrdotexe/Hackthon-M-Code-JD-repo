'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Bell, Save } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBanner from '@/components/ErrorBanner';
import SuccessBanner from '@/components/SuccessBanner';
import XPBadge from '@/components/XPBadge';
import StreakBadge from '@/components/StreakBadge';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);

  // Profile form state
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');

  // Upgrade form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);

  // Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getProfile();
      setProfile(data);
      
      // Populate form fields
      setDob(data.dob || '');
      setAge(data.age?.toString() || '');
      setHeight(data.height?.toString() || '');
      setWeight(data.weight?.toString() || '');
      setGender(data.gender || '');
      setEmail(data.email || '');
      setNotificationsEnabled(data.notificationsEnabled || false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const profileData = {};
      if (dob) profileData.dob = dob;
      if (age) profileData.age = parseInt(age);
      if (height) profileData.height = parseInt(height);
      if (weight) profileData.weight = parseInt(weight);
      if (gender) profileData.gender = gender;
      profileData.notificationsEnabled = notificationsEnabled;

      await api.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
      await loadProfile();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setUpgrading(true);
    setError(null);

    try {
      await api.upgradeAccount(email, password);
      setSuccess('Account upgraded successfully! Your progress is now secure.');
      setShowUpgradeForm(false);
      await loadProfile();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isAnonymous = !profile?.email;
  const { gamification } = profile || {};
  const { xp = 0, level = 1, streak = 0 } = gamification || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-200 py-10">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessBanner message={success} onDismiss={() => setSuccess(null)} />}

      <div className="max-w-4xl mx-auto px-6 grid gap-8 lg:grid-cols-[2fr,3fr]">
        <div className="space-y-6">
          {/* Header */}
          <div className="animate-slide-up">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Profile
            </h1>
            <p className="text-gray-600">
              {isAnonymous ? 'Anonymous user' : email}
            </p>
          </div>

          {/* Profile Header Card */}
          <div className="card-elevated animate-slide-up animate-delay-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-400 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
                  {isAnonymous ? 'Anonymous' : 'Your Account'}
                </h2>
                <XPBadge xp={xp} level={level} showProgress={true} />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <StreakBadge streak={streak} />
            </div>
          </div>

          {/* Account Upgrade Section */}
          {isAnonymous && (
            <div className="card-elevated bg-gradient-to-br from-teal-50 to-cream-50 animate-slide-up animate-delay-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-gray-900 mb-2">
                    Secure Your Progress
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upgrade with email so you don't lose your XP or streak if you switch devices.
                  </p>
                </div>
              </div>

              {!showUpgradeForm ? (
                <button
                  onClick={() => setShowUpgradeForm(true)}
                  className="btn-primary w-full"
                >
                  Upgrade Account
                </button>
              ) : (
                <form onSubmit={handleUpgrade} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="input-field pl-11"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="input-field pl-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowUpgradeForm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={upgrading}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {upgrading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Upgrading...</span>
                        </>
                      ) : (
                        'Upgrade'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* App Info */}
          <div className="text-sm text-gray-500 animate-slide-up animate-delay-500">
            <p>Beat the Sugar Spike v1.0</p>
            <p className="mt-1">Track mindfully. Live healthily. 🌱</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Details Form */}
          <form onSubmit={handleSaveProfile} className="card animate-slide-up animate-delay-300">
            <h3 className="font-display font-bold text-gray-900 mb-4">
              Profile Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </form>

          {/* Settings */}
          <div className="card animate-slide-up animate-delay-400">
            <h3 className="font-display font-bold text-gray-900 mb-4">
              Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Notifications</p>
                  <p className="text-sm text-gray-500">Get reminders to log sugar</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  notificationsEnabled ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}