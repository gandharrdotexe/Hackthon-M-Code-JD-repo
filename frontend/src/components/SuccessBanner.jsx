import { CheckCircle2, X } from 'lucide-react';

export default function SuccessBanner({ message, onDismiss }) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
        <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-teal-800 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-teal-400 hover:text-teal-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}