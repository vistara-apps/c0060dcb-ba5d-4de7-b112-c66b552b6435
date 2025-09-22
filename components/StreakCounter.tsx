'use client';

import { cn } from '@/lib/utils';
import { getStreakEmoji } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakCounter({ streak, className, size = 'md' }: StreakCounterProps) {
  const emoji = getStreakEmoji(streak);
  
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={cn(
      'flex items-center justify-center space-x-2',
      'bg-gradient-to-r from-accent/20 to-primary/20',
      'rounded-xl p-md border border-accent/30',
      className
    )}>
      <span className={sizes[size]}>{emoji}</span>
      <div className="text-center">
        <div className={cn(
          'font-bold gradient-text',
          size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'
        )}>
          {streak}
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          Day{streak !== 1 ? 's' : ''} Streak
        </div>
      </div>
    </div>
  );
}
