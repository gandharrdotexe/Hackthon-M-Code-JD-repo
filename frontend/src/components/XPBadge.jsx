'use client';

import { Sparkles } from 'lucide-react';
import { calculateXPProgress } from '@/lib/utils';

export default function XPBadge({ xp = 0, level = 1, showProgress = false, animated = false }) {
  const progress = calculateXPProgress(xp, level);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-full shadow-md">
        <Sparkles className={`w-4 h-4 ${animated ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-semibold">Level {level}</span>
      </div>
      
      {showProgress && (
        <div className="flex-1 max-w-[120px]">
          <div className="xp-bar">
            <div
              className={`xp-fill ${animated ? 'animate-pulse' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{xp} XP</p>
        </div>
      )}
    </div>
  );
}