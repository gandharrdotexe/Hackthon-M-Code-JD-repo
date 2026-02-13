import { format, formatDistanceToNow, isToday } from 'date-fns';

// Generate device UUID
export function generateDeviceUUID() {
  if (typeof window !== 'undefined') {
    let uuid = localStorage.getItem('device_uuid');
    if (!uuid) {
      uuid = crypto.randomUUID();
      localStorage.setItem('device_uuid', uuid);
    }
    return uuid;
  }
  return crypto.randomUUID();
}

// Format date/time
export function formatLogTime(dateString) {
  const date = new Date(dateString);
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

// Map sugar types to icons and labels
export const SUGAR_TYPES = {
  chai: { label: 'Chai', icon: '☕', color: 'from-amber-400 to-orange-500' },
  coffee: { label: 'Coffee', icon: '☕', color: 'from-amber-600 to-amber-800' },
  dessert: { label: 'Dessert', icon: '🍰', color: 'from-pink-400 to-rose-500' },
  'cold drink': { label: 'Cold Drink', icon: '🥤', color: 'from-blue-400 to-cyan-500' },
  sweets: { label: 'Sweets', icon: '🍬', color: 'from-purple-400 to-pink-500' },
  other: { label: 'Other', icon: '🍽️', color: 'from-gray-400 to-gray-600' },
};

// Time of day options
export const TIME_OF_DAY = [
  { value: 'morning', label: 'Morning', icon: '🌅' },
  { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { value: 'evening', label: 'Evening', icon: '🌆' },
  { value: 'night', label: 'Night', icon: '🌙' },
];

// Sugar estimate options
export const SUGAR_ESTIMATES = [
  { value: 5, label: 'Light', grams: 5 },
  { value: 12, label: 'Moderate', grams: 12 },
  { value: 25, label: 'Heavy', grams: 25 },
];

// Get current time of day
export function getCurrentTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Calculate XP progress percentage
export function calculateXPProgress(currentXP, level) {
  const xpForNextLevel = level * 100; // Simple calculation, adjust based on backend
  return Math.min((currentXP / xpForNextLevel) * 100, 100);
}