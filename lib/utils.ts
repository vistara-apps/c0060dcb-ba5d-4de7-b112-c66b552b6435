import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function isToday(date: string | Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
}

export function getDaysInStreak(startDate: string, logs: Array<{ logDate: string; isAdherent: boolean }>): number {
  const sortedLogs = logs
    .filter(log => log.isAdherent)
    .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());

  if (sortedLogs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  let currentDate = new Date(today);

  for (const log of sortedLogs) {
    const logDate = new Date(log.logDate);
    const diffTime = currentDate.getTime() - logDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }

  return streak;
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🏆';
  if (streak >= 50) return '💎';
  if (streak >= 30) return '🔥';
  if (streak >= 14) return '⚡';
  if (streak >= 7) return '🌟';
  if (streak >= 3) return '💪';
  return '🌱';
}

export function getBadgeColor(rarity: string): string {
  switch (rarity) {
    case 'legendary': return 'from-yellow-400 to-orange-500';
    case 'epic': return 'from-purple-400 to-pink-500';
    case 'rare': return 'from-blue-400 to-cyan-500';
    default: return 'from-gray-400 to-gray-500';
  }
}
