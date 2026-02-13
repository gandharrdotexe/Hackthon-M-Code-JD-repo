'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lightbulb, Award, CheckCircle2 } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import { SUGAR_TYPES, TIME_OF_DAY, SUGAR_ESTIMATES, getCurrentTimeOfDay } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBanner from '@/components/ErrorBanner';
import SuccessBanner from '@/components/SuccessBanner';

export default function LogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [selectedType, setSelectedType] = useState('');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(getCurrentTimeOfDay());
  const [selectedSugarLevel, setSelectedSugarLevel] = useState(12); // Moderate default
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [heartRate, setHeartRate] = useState('');
  
  // Result state
  const [result, setResult] = useState(null);
  const [actionCompleting, setActionCompleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      setError('Please select a sugar type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const logData = {
        type: selectedType,
        method: 'preset',
        sugarEstimate: selectedSugarLevel,
        timeOfDay: selectedTimeOfDay,
      };

      // Add optional context
      const contextSnapshot = {};
      if (steps) contextSnapshot.steps = parseInt(steps);
      if (sleepHours) contextSnapshot.sleepHours = parseFloat(sleepHours);
      if (heartRate) contextSnapshot.heartRate = parseInt(heartRate);
      
      if (Object.keys(contextSnapshot).length > 0) {
        logData.contextSnapshot = contextSnapshot;
      }

      const response = await api.logSugar(logData);
      setResult(response);
      
      // Reset form
      setSelectedType('');
      setSelectedSugarLevel(12);
      setSteps('');
      setSleepHours('');
      setHeartRate('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = async () => {
    if (!result?._id) return;

    setActionCompleting(true);
    try {
      await api.completeAction(result._id);
      setSuccess('Nice work! You earned extra XP.');
      setResult({ ...result, actionCompleted: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionCompleting(false);
    }
  };

  const handleNewLog = () => {
    setResult(null);
    setSuccess(null);
  };

  // Show result view
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cream-100 py-10">
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
        {success && <SuccessBanner message={success} onDismiss={() => setSuccess(null)} />}

        <div className="max-w-4xl mx-auto px-6 space-y-6 animate-slide-up">
          {/* XP & Reward Banner */}
          <div className="card-elevated bg-gradient-to-br from-teal-500 to-teal-400 text-white animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">You earned</p>
                <p className="text-3xl font-display font-bold">+{result.xpEarned} XP</p>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-12 h-12 animate-bounce-gentle" />
              </div>
            </div>
            {result.reward && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm opacity-90">Reward: {result.reward.description}</p>
                <p className="text-xl font-bold">🪙 {result.reward.value} coins</p>
              </div>
            )}
          </div>

          {/* Insight Card */}
          <div className="card-elevated animate-slide-up animate-delay-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900">
                Today's Insight
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {result.insight}
            </p>
          </div>

          {/* Suggested Action Card */}
          <div className="card-elevated animate-slide-up animate-delay-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-900">
                Suggested Action
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {result.suggestion}
            </p>
            {!result.actionCompleted ? (
              <button
                onClick={handleActionComplete}
                disabled={actionCompleting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {actionCompleting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    I did this
                  </>
                )}
              </button>
            ) : (
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <p className="text-sm font-medium text-teal-800">
                  Action completed! ✨
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleNewLog}
              className="btn-secondary flex-1"
            >
              Log another
            </button>
            <button
              onClick={() => router.push('/home')}
              className="btn-primary flex-1"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show form view
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-200 py-10">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Log Sugar Event
          </h1>
          <p className="text-gray-600">
            Quick logging in under 10 seconds ⚡
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sugar Type */}
          <div className="animate-slide-up animate-delay-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What did you have? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(SUGAR_TYPES).map(([key, { label, icon, color }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedType(key)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedType === key
                      ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20 scale-105'
                      : 'border-cream-400 bg-white hover:border-primary-300'
                  }`}
                >
                  <span className="text-3xl mb-2 block">{icon}</span>
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sugar Level */}
          <div className="animate-slide-up animate-delay-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How much sugar?
            </label>
            <div className="flex gap-3">
              {SUGAR_ESTIMATES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedSugarLevel(value)}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                    selectedSugarLevel === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-cream-400 bg-white text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div className="animate-slide-up animate-delay-300">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              When?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_OF_DAY.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedTimeOfDay(value)}
                  className={`px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                    selectedTimeOfDay === value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-cream-400 bg-white hover:border-primary-300'
                  }`}
                >
                  <span className="block text-lg mb-1">{icon}</span>
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Context */}
          <div className="card animate-slide-up animate-delay-400">
            <h3 className="font-display font-semibold text-gray-900 mb-4">
              Optional: Add context
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Steps today
                </label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="e.g. 5000"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Sleep (hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  placeholder="e.g. 7.5"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Heart rate (bpm)
                </label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="e.g. 75"
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedType}
            className="btn-primary w-full flex items-center justify-center gap-2 animate-slide-up animate-delay-500"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Analyzing your day...</span>
              </>
            ) : (
              'Log this'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}