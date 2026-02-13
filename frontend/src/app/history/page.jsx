'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { api, getErrorMessage } from '@/lib/api';
import { formatLogTime, SUGAR_TYPES } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBanner from '@/components/ErrorBanner';
import SuccessBanner from '@/components/SuccessBanner';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [actionCompleting, setActionCompleting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getHistory(20);
      setLogs(data.logs || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = async (logId) => {
    setActionCompleting(true);
    try {
      await api.completeAction(logId);
      setSuccess('Nice work! You earned extra XP.');
      
      // Update the log in state
      setLogs(logs.map(log => 
        log._id === logId ? { ...log, actionCompleted: true } : log
      ));
      
      if (selectedLog?._id === logId) {
        setSelectedLog({ ...selectedLog, actionCompleted: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-100 to-cream-200 p-6 pb-24 flex items-center justify-center">
        <div className="text-center max-w-md animate-slide-up">
          <div className="w-24 h-24 bg-cream-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">
            No logs yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start by logging your first sugar event to see your history here.
          </p>
          <button
            onClick={() => window.location.href = '/log'}
            className="btn-primary"
          >
            Log your first event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 to-cream-200 p-6 pb-24">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessBanner message={success} onDismiss={() => setSuccess(null)} />}

      <div className="max-w-md mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            History
          </h1>
          <p className="text-gray-600">
            {logs.length} {logs.length === 1 ? 'event' : 'events'} logged
          </p>
        </div>

        <div className="space-y-4">
          {logs.map((log, index) => {
            const sugarType = SUGAR_TYPES[log.type] || SUGAR_TYPES.other;
            
            return (
              <div
                key={log._id}
                className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${sugarType.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-2xl">{sugarType.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-gray-900 capitalize">
                          {sugarType.label}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatLogTime(log.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {log.actionCompleted && (
                          <div className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </div>
                        )}
                        <div className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
                          +{log.xpEarned} XP
                        </div>
                      </div>
                    </div>

                    {log.generatedInsight && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {log.generatedInsight}
                      </p>
                    )}

                    {log.timeOfDay && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500 capitalize">
                          {log.timeOfDay}
                        </span>
                        {log.sugarEstimate && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              ~{log.sugarEstimate}g sugar
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-slide-up"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${SUGAR_TYPES[selectedLog.type]?.color || SUGAR_TYPES.other.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <span className="text-3xl">
                  {SUGAR_TYPES[selectedLog.type]?.icon || SUGAR_TYPES.other.icon}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 capitalize">
                  {SUGAR_TYPES[selectedLog.type]?.label || 'Other'}
                </h2>
                <p className="text-sm text-gray-500">
                  {formatLogTime(selectedLog.createdAt)}
                </p>
              </div>
            </div>

            {/* Insight */}
            {selectedLog.generatedInsight && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <h3 className="font-display font-semibold text-gray-900">
                    Insight
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed bg-primary-50 rounded-xl p-4">
                  {selectedLog.generatedInsight}
                </p>
              </div>
            )}

            {/* Suggested Action */}
            {selectedLog.suggestedAction && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-gray-900 mb-3">
                  Suggested Action
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {selectedLog.suggestedAction}
                </p>
                {!selectedLog.actionCompleted ? (
                  <button
                    onClick={() => handleActionComplete(selectedLog._id)}
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
                        Mark as done
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
            )}

            {/* Context */}
            {selectedLog.contextSnapshot && Object.keys(selectedLog.contextSnapshot).length > 0 && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-gray-900 mb-3">
                  Context
                </h3>
                <div className="bg-cream-100 rounded-xl p-4 space-y-2">
                  {selectedLog.contextSnapshot.steps && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Steps:</span> {selectedLog.contextSnapshot.steps}
                    </p>
                  )}
                  {selectedLog.contextSnapshot.sleepHours && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Sleep:</span> {selectedLog.contextSnapshot.sleepHours} hours
                    </p>
                  )}
                  {selectedLog.contextSnapshot.heartRate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Heart rate:</span> {selectedLog.contextSnapshot.heartRate} bpm
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedLog(null)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}