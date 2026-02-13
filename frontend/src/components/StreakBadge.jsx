'use client';

import { Flame } from 'lucide-react';

export default function StreakBadge({ streak = 0, animated = false }) {
  return (
    <div className={`streak-badge ${animated ? 'animate-bounce-gentle' : ''}`}>
      <Flame className="w-5 h-5" />
      <span className="font-bold">{streak}-day streak</span>
    </div>
  );
}