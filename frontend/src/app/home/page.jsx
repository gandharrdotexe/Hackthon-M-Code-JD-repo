'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, TrendingUp, Plus } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBanner from '@/components/ErrorBanner';
import XPBadge from '@/components/XPBadge';
import StreakBadge from '@/components/StreakBadge';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyStatus, setDailyStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [lastLog, setLastLog] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const token = api.getToken();
      if (!token) {
        router.push('/');
        return;
      }

      // Load daily status and profile in parallel
      const [statusData, profileData, historyData] = await Promise.all([
        api.getDailyStatus(),
        api.getProfile(),
        api.getHistory(1),
      ]);

      setDailyStatus(statusData);
      setProfile(profileData);
      if (historyData.logs && historyData.logs.length > 0) {
        setLastLog(historyData.logs[0]);
      }
    } catch (err) {
      if (err.status === 401) {
        router.push('/');
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { hasLoggedToday, streak, progressPercent, motivationalCopy } = dailyStatus || {};
  const { gamification } = profile || {};
  const { xp = 0, level = 1 } = gamification || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 to-cream-200 p-6 pb-24">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              {hasLoggedToday ? 'Great job!' : 'Welcome back'}
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <XPBadge xp={xp} level={level} showProgress={true} />
        </div>
      </div>

      {/* Daily Ritual Card */}
      <div className="card-elevated mb-6 animate-slide-up animate-delay-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">
                Daily Ritual
              </h2>
            </div>
          </div>
          <StreakBadge streak={streak || 0} animated={hasLoggedToday} />
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-cream-300"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - (progressPercent || 0) / 100)}`}
                className="text-primary-500 transition-all duration-700"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary-600">
                  {progressPercent || 0}%
                </p>
                <p className="text-xs text-gray-500">progress</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed mb-3">
              {motivationalCopy || 'Keep building your streak!'}
            </p>
            {!hasLoggedToday && (
              <p className="text-sm text-primary-600 font-medium">
                You haven't logged today yet. Logging keeps your streak alive! 🔥
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/log')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {hasLoggedToday ? 'Log another event' : 'Log sugar now'}
        </button>
      </div>

      {/* Last Log Summary */}
      {lastLog && (
        <div className="card animate-slide-up animate-delay-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <h3 className="font-display font-semibold text-gray-900">
              Last Activity
            </h3>
          </div>
          <div className="bg-cream-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{lastLog.type === 'chai' ? '☕' : '🍬'}</span>
              <div>
                <p className="font-medium text-gray-900 capitalize">{lastLog.type}</p>
                <p className="text-xs text-gray-500">
                  {new Date(lastLog.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            {lastLog.generatedInsight && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {lastLog.generatedInsight}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}