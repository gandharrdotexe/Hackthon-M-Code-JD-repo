import { AlertCircle, X } from 'lucide-react';

export default function ErrorBanner({ message, onDismiss, actionLabel, onAction }) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">{message}</p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}