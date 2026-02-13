'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Zap, Trophy } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import { generateDeviceUUID } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBanner from '@/components/ErrorBanner';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnonymousStart = async () => {
    setLoading(true);
    setError(null);

    try {
      const deviceUuid = generateDeviceUUID();
      await api.anonymousLogin(deviceUuid);
      router.push('/home');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-200 via-cream-100 to-primary-50 flex items-center justify-center p-6">
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
          actionLabel="Try again"
          onAction={handleAnonymousStart}
        />
      )}

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-400 rounded-3xl shadow-xl shadow-primary-500/30 mb-6 animate-bounce-gentle">
            <span className="text-4xl">🍬</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-gradient mb-3">
            Beat the Sugar Spike
          </h1>
          <p className="text-lg text-gray-600">
            Track sugar. Get instant insights. Build streaks.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-10">
          <div className="card flex items-start gap-4 animate-slide-up animate-delay-100">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900 mb-1">
                Anonymous & Private
              </h3>
              <p className="text-sm text-gray-600">
                Start tracking without signup. Your data stays with you.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4 animate-slide-up animate-delay-200">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900 mb-1">
                Log in Under 10 Seconds
              </h3>
              <p className="text-sm text-gray-600">
                Quick presets for chai, sweets, and everyday sugar events.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4 animate-slide-up animate-delay-300">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-gray-900 mb-1">
                Earn Streaks & Rewards
              </h3>
              <p className="text-sm text-gray-600">
                Build daily habits. Level up. Get personalized insights.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAnonymousStart}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Starting...</span>
              </>
            ) : (
              'Start without signup'
            )}
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="btn-secondary w-full"
            disabled={loading}
          >
            I already have an account
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your journey to better sugar awareness starts here 🌟
        </p>
      </div>
    </div>
  );
}